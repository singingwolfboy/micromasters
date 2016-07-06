"""
Management command to recreate the Elasticsearch index
"""

from django.core.management.base import BaseCommand

from search.api import (
    recreate_index,
)


class Command(BaseCommand):
    """
    Command for recreate_index
    """
    help = "Clears existing Elasticsearch indices and creates a new index and mapping."

    def handle(self, *args, **kwargs):  # pylint: disable=unused-argument
        """
        Recreates the index
        """
        recreate_index()
