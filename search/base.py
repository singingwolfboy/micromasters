"""
Base test classes for search
"""
from django.test import TestCase

from search.api import clear_index


class ESTestCase(TestCase):
    """
    Set up ES index on setup
    """

    def setUp(self):
        super(ESTestCase, self).setUp()
        clear_index()
