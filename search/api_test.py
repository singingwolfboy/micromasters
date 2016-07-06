"""
Tests for search API functions.
"""

from urllib.parse import urljoin

from django.conf import settings
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from factory.django import mute_signals
from rest_framework.fields import DateTimeField
from requests import get

from profiles.api import get_social_username
from profiles.factories import (
    EducationFactory,
    EmploymentFactory,
    ProfileFactory,
    UserFactory,
)
from profiles.serializers import (
    EducationSerializer,
    EmploymentSerializer,
)
from profiles.util import (
    GravatarImgSize,
    format_gravatar_url,
)
from search.api import (
    get_conn,
    index_users,
    refresh_index,
    remove_user,
    serialize_user,
)
from search.base import ESTestCase
from search.exceptions import ReindexException


def remove_key(dictionary, key):
    """Helper method to remove a key from a dict and return the dict"""
    del dictionary[key]
    return dictionary


def search():
    """
    Execute a search and get results
    """
    # Refresh the index so we can read current data
    refresh_index()

    elasticsearch_url = settings.ELASTICSEARCH_URL
    if not elasticsearch_url.startswith("http"):
        elasticsearch_url = "http://{}".format(elasticsearch_url)
    url = urljoin(
        elasticsearch_url,
        "{}/{}".format(settings.ELASTICSEARCH_INDEX, "_search")
    )
    return get(url).json()['hits']


def assert_search(results, users):
    """
    Assert that search results match users
    """
    assert results['total'] == len(users)
    sources = sorted([hit['_source'] for hit in results['hits']], key=lambda hit: hit['id'])
    sorted_users = sorted(users, key=lambda user: user.id)
    serialized = [remove_key(serialize_user(user), "_id") for user in sorted_users]
    assert serialized == sources


# pylint: disable=no-self-use
class IndexTests(ESTestCase):
    """
    Tests for indexing
    """

    def test_user_add(self):
        """
        Test that a newly created User is indexed properly
        """
        assert search()['total'] == 0
        user = UserFactory.create()
        assert_search(search(), [user])

    def test_user_update(self):
        """
        Test that User is reindexed after being updated
        """
        user = UserFactory.create()
        assert search()['total'] == 1
        profile = user.profile
        profile.first_name = 'updated'
        profile.save()
        assert_search(search(), [user])

    def test_user_delete(self):
        """
        Test that User is removed from index after being updated
        """
        user = UserFactory.create()
        assert search()['total'] == 1
        user.profile.delete()
        assert search()['total'] == 0

    def test_education_add(self):
        """
        Test that Education is indexed after being added
        """
        user = UserFactory.create()
        assert search()['total'] == 1
        EducationFactory.create(profile=user.profile)
        assert_search(search(), [user])

    def test_education_update(self):
        """
        Test that Education is reindexed after being updated
        """
        user = UserFactory.create()
        assert search()['total'] == 1
        education = EducationFactory.create(profile=user.profile)
        education.school_city = 'city'
        education.save()
        assert_search(search(), [user])

    def test_education_delete(self):
        """
        Test that Education is removed from index after being deleted
        """
        user = UserFactory.create()
        education = EducationFactory.create(profile=user.profile)
        assert_search(search(), [user])
        education.delete()
        assert_search(search(), [user])

    def test_employment_add(self):
        """
        Test that Employment is indexed after being added
        """
        user = UserFactory.create()
        assert search()['total'] == 1
        EmploymentFactory.create(profile=user.profile)
        assert_search(search(), [user])

    def test_employment_update(self):
        """
        Test that Employment is reindexed after being updated
        """
        user = UserFactory.create()
        assert search()['total'] == 1
        employment = EmploymentFactory.create(profile=user.profile)
        employment.city = 'city'
        employment.save()
        assert_search(search(), [user])

    def test_employment_delete(self):
        """
        Test that Employment is removed from index after being deleted
        """
        user = UserFactory.create()
        employment = EmploymentFactory.create(profile=user.profile)
        assert_search(search(), [user])
        employment.delete()
        assert_search(search(), [user])

    def test_remove_profile(self):
        """
        Test that remove_profile removes the profile from the index
        """
        user = UserFactory.create()
        assert_search(search(), [user])
        remove_user(user)
        assert_search(search(), [])

    def test_index_users(self):
        """
        Test that index_profiles indexes an iterable of profiles
        """
        for _ in range(10):
            with mute_signals(post_save):
                # using ProfileFactory instead of UserFactory here since UserFactory will not fill in any
                # fields on Profile
                profile = ProfileFactory.create()
            # Not strictly necessary, the muted post_save will prevent indexing
            remove_user(profile.user)

        # Confirm nothing in index
        assert_search(search(), [])
        index_users(User.objects.iterator(), chunk_size=4)
        assert_search(search(), list(User.objects.all()))


class SerializerTests(ESTestCase):
    """
    Tests for profile serializer
    """

    def test_profile_serializer(self):  # pylint: disable=no-self-use
        """
        Asserts the output of the profile serializer
        """
        with mute_signals(post_save):
            profile = ProfileFactory.create()
        EducationFactory.create(profile=profile)
        EmploymentFactory.create(profile=profile)

        assert serialize_user(profile.user) == {
            '_id': profile.user.id,
            'id': profile.user.id,
            'profile': {
                'username': get_social_username(profile.user),
                'first_name': profile.first_name,
                'filled_out': profile.filled_out,
                'agreed_to_terms_of_service': profile.agreed_to_terms_of_service,
                'last_name': profile.last_name,
                'preferred_name': profile.preferred_name,
                'email_optin': profile.email_optin,
                'gender': profile.gender,
                'date_of_birth': DateTimeField().to_representation(profile.date_of_birth),
                'account_privacy': profile.account_privacy,
                'has_profile_image': profile.has_profile_image,
                'profile_url_full': format_gravatar_url(profile.user.email, GravatarImgSize.FULL),
                'profile_url_large': format_gravatar_url(profile.user.email, GravatarImgSize.LARGE),
                'profile_url_medium': format_gravatar_url(profile.user.email, GravatarImgSize.MEDIUM),
                'profile_url_small': format_gravatar_url(profile.user.email, GravatarImgSize.SMALL),
                'country': profile.country,
                'state_or_territory': profile.state_or_territory,
                'city': profile.city,
                'birth_country': profile.birth_country,
                'birth_state_or_territory': profile.birth_state_or_territory,
                'birth_city': profile.birth_city,
                'preferred_language': profile.preferred_language,
                'pretty_printed_student_id': profile.pretty_printed_student_id,
                'edx_level_of_education': profile.edx_level_of_education,
                'education': [
                    EducationSerializer().to_representation(education) for education in profile.education.all()
                ],
                'work_history': [
                    EmploymentSerializer().to_representation(work_history) for work_history in
                    profile.work_history.all()
                ]
            }
        }


class GetConnTests(ESTestCase):
    """
    Tests for get_conn
    """
    def setUp(self):
        """
        Start without any index
        """
        super(GetConnTests, self).setUp()

        conn = get_conn(verify=False)
        index_name = settings.ELASTICSEARCH_INDEX
        conn.indices.delete(index_name)

        # Clear globals
        from search import api
        api._CONN = None  # pylint: disable=protected-access
        api._CONN_VERIFIED = False  # pylint: disable=protected-access

    def test_no_index(self):
        """
        Test that an error is raised if we don't have an index
        """
        with self.assertRaises(ReindexException) as ex:
            get_conn()
        assert str(ex.exception) == "Unable to find index {}".format(settings.ELASTICSEARCH_INDEX)

    def test_no_mapping(self):
        """
        Test that error is raised if we don't have a mapping
        """
        conn = get_conn(verify=False)
        conn.indices.create(settings.ELASTICSEARCH_INDEX)

        with self.assertRaises(ReindexException) as ex:
            get_conn()
        assert str(ex.exception) == "Mapping user not found"
