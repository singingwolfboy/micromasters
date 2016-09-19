"""
Tests for ecommerce permissions
"""
from unittest import TestCase

from mock import MagicMock

from ecommerce.api import generate_cybersource_sa_signature
from ecommerce.permissions import IsSignedByCyberSource


# pylint: disable=no-self-use
class PermissionsTests(TestCase):
    """
    Tests for ecommerce permissions
    """

    def test_has_signature(self):
        """
        If the payload has a valid signature, it should pass the permissions test
        """
        payload = {
            'a': 'b',
            'c': 'd',
            'e': 'f',
        }
        keys = sorted(payload.keys())
        payload['signed_field_names'] = ','.join(keys)
        payload['signature'] = generate_cybersource_sa_signature(payload)

        request = MagicMock(data=payload)
        assert IsSignedByCyberSource().has_permission(request, MagicMock()) is True

    def test_has_wrong_signature(self):
        """
        If the payload has an invalid signature, it should fail the permissions test
        """
        payload = {
            'a': 'b',
            'c': 'd',
            'e': 'f',
        }
        keys = sorted(payload.keys())
        payload['signed_field_names'] = ','.join(keys)
        payload['signature'] = 'signed'

        request = MagicMock(data=payload)
        assert IsSignedByCyberSource().has_permission(request, MagicMock()) is False
