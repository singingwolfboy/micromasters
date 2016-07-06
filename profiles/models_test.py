"""
Model tests
"""
# pylint: disable=no-self-use
from django.db.models.signals import post_save
from factory.django import mute_signals
from profiles.factories import ProfileFactory, UserFactory
from profiles.models import Profile
from search.base import ESTestCase


class ProfileTests(ESTestCase):
    """tests for the profile model"""

    def test_student_id_on_save(self):
        """test that a student id is set on save"""
        with mute_signals(post_save):
            profile = ProfileFactory()
        assert profile.student_id is not None

    def test_student_id_increments(self):
        """test that a student id increments correctly"""
        with mute_signals(post_save):
            profile_one = ProfileFactory()
            profile_two = ProfileFactory()
        assert profile_two.student_id > profile_one.student_id

    def test_student_id_doesnt_change_on_save(self):
        """test that a saved id isn't overwritten"""
        with mute_signals(post_save):
            profile = ProfileFactory()
        assert profile.student_id is not None
        current_id = profile.student_id
        with mute_signals(post_save):
            profile.save()
        profile.refresh_from_db()
        assert profile.student_id == current_id

    def test_student_id_should_pretty_print(self):
        """test pretty printing property method"""
        with mute_signals(post_save):
            profile = ProfileFactory()
        assert profile.pretty_printed_student_id == "MMM{0:06}".format(profile.student_id)

    def test_student_id_should_be_blank_if_not_yet_saved(self):
        """test student id when model instance not yet saved"""
        with mute_signals(post_save):
            user = UserFactory()
        profile = Profile(user=user)
        assert profile.student_id is None
        assert profile.pretty_printed_student_id is ''
