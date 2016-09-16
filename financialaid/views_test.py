"""
Tests for financialaid view
"""
from django.core.urlresolvers import reverse
from django.db.models.signals import post_save

from factory.django import mute_signals
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from rest_framework.test import APIClient

from financialaid.api_tests import FinancialAidBaseTestCase
from financialaid.models import FinancialAid, FinancialAidStatus
from profiles.factories import ProfileFactory


class FinancialAidViewTests(FinancialAidBaseTestCase, APIClient):
    """
    Tests for financialaid views
    """
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        with mute_signals(post_save):
            cls.profile2 = ProfileFactory.create()

    def setUp(self):
        super().setUp()
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
        # Test that a FinancialAid object is created and is not auto-approved
        assert FinancialAid.objects.count() == 0
        resp = self.client.post(reverse("financialaid_api"), self.data, format='json')
        assert resp.status_code == HTTP_201_CREATED
        assert FinancialAid.objects.count() == 1
        financial_aid = FinancialAid.objects.first()
        assert financial_aid.tier_program == self.tiers["50k"]
        assert financial_aid.status == FinancialAidStatus.PENDING_DOCS
        # Test that a FinancialAid object is created and is auto-approved
        self.data["original_income"] = 200000
        resp = self.client.post(reverse("financialaid_api"), self.data, format='json')
        assert resp.status_code == HTTP_201_CREATED
        assert FinancialAid.objects.count() == 2
        financial_aid = FinancialAid.objects.last()
        assert financial_aid.tier_program == self.tiers["100k"]
        assert financial_aid.status == FinancialAidStatus.AUTO_APPROVED

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
