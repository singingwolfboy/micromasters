"""
Test search management commands
"""

from django.conf import settings

from profiles.factories import UserFactory
from search.api import (
    get_conn,
    recreate_index,
    remove_user,
)
from search.api_test import (
    assert_search,
    search,
)
from search.base import ESTestCase


class RecreateIndexTests(ESTestCase):
    """
    Tests for management commands
    """
    def setUp(self):
        """
        Start without any index
        """
        super(RecreateIndexTests, self).setUp()
        conn = get_conn(verify=False)
        index_name = settings.ELASTICSEARCH_INDEX
        if conn.indices.exists(index_name):
            conn.indices.delete(index_name)

    def test_create_index(self):  # pylint: disable=no-self-use
        """
        Test that recreate_index will create an index and let search successfully
        """
        recreate_index()
        assert search()['total'] == 0

    def test_update_index(self):  # pylint: disable=no-self-use
        """
        Test that recreate_index will clear old data and index all profiles
        """
        recreate_index()
        user = UserFactory.create()
        assert_search(search(), [user])
        remove_user(user)
        # No profiles in Elasticsearch
        assert_search(search(), [])

        # recreate_index will index the profile
        recreate_index()
        assert_search(search(), [user])
