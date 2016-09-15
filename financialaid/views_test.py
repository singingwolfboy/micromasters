"""
Tests for financialaid view
"""
from django.core.urlresolvers import reverse
from django.db.models.signals import post_save

from factory.django import mute_signals
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from rest_framework.test import APIClient

from financialaid.backend_tests import FinancialAidBackendTests
from financialaid.models import FinancialAid
from profiles.factories import ProfileFactory


class FinancialAidViewTests(FinancialAidBackendTests, APIClient):
    """
    Tests for financialaid views
    """
    def setUp(self):
        super().setUp()
        with mute_signals(post_save):
            self.profile2 = ProfileFactory.create()
        self.client.force_login(self.profile.user)
        self.data = {
            "original_currency": "USD",
            "program_id": self.program.id,
            "original_income": 80000
        }

    def test_income_validation(self):
        """
        Tests IncomeValidationView post endpoint
        """
        assert FinancialAid.objects.count() == 0
        resp = self.client.post(reverse("financialaid_api"), self.data, format='json')
        assert resp.status_code == HTTP_201_CREATED
        assert FinancialAid.objects.count() == 1
        financial_aid = FinancialAid.objects.first()
        assert financial_aid.tier_program == self.tiers["50k"]

    def test_income_validation_missing_args(self):
        """
        Tests IncomeValidationView post with missing args
        """
        for key_to_not_send in ["original_currency", "program_id", "original_income"]:
            data = {key: value for key, value in self.data.items() if key != key_to_not_send}
            resp = self.client.post(reverse("financialaid_api"), data)
            assert resp.status_code == HTTP_400_BAD_REQUEST

    def test_income_validation_no_financial_aid_availability(self):
        """
        Tests IncomeValidationView post when financial aid not available for program
        """
        self.program.financial_aid_availability = False
        self.program.save()
        resp = self.client.post(reverse("financialaid_api"), self.data)
        assert resp.status_code == HTTP_400_BAD_REQUEST

    def test_income_validation_user_not_enrolled(self):
        """
        Tests IncomeValidationView post when User not enrolled in program
        """
        self.program_enrollment.user = self.profile2.user
        self.program_enrollment.save()
        resp = self.client.post(reverse("financialaid_api"), self.data)
        assert resp.status_code == HTTP_400_BAD_REQUEST

    def test_income_validation_currency_not_usd(self):
        """
        Tests IncomeValidationView post  Only takes USD
        """
        self.data["original_currency"] = "NOTUSD"
        resp = self.client.post(reverse("financialaid_api"), self.data)
        assert resp.status_code == HTTP_400_BAD_REQUEST
