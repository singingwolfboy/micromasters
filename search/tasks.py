"""
Celery tasks for search
"""

from micromasters.celery import async
from search.api import (
    index_users as _index_users,
    remove_user as _remove_user
)


@async.task
def index_users(users):
    """
    Index profiles

    Args:
        users (iterable of User):
            Iterable of Users
    """
    _index_users(users)


@async.task
def remove_user(user):
    """
    Remove profile from index

    Args:
        user (User):
            A user to remove from index
    """
    _remove_user(user)
