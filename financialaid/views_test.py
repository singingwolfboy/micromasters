"""
Tests for financialaid view
"""
from django.core.urlresolvers import reverse
from django.db.models.signals import post_save

from factory.django import mute_signals
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from rest_framework.test import APIClient

from financialaid.api_test import FinancialAidBaseTestCase
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
        cls.url = reverse("financialaid_api")

    def setUp(self):
        super().setUp()
        self.client.force_login(self.profile.user)
        self.data = {
            "original_currency": "USD",
            "program_id": self.program.id,
            "original_income": 80000
        }

    def test_income_validation_not_auto_approved(self):
        """
        Tests IncomeValidationView post endpoint for not-auto-approval
        """
        assert FinancialAid.objects.count() == 0
        resp = self.client.post(self.url, self.data, format='json')
        assert resp.status_code == HTTP_201_CREATED
        assert FinancialAid.objects.count() == 1
        financial_aid = FinancialAid.objects.first()
        assert financial_aid.tier_program == self.tiers["50k"]
        assert financial_aid.status == FinancialAidStatus.PENDING_DOCS

    def test_income_validation_auto_approved(self):
        """
        Tests IncomeValidationView post endpoint for auto-approval
        """
        assert FinancialAid.objects.count() == 0
        self.data["original_income"] = 200000
        resp = self.client.post(self.url, self.data, format='json')
        assert resp.status_code == HTTP_201_CREATED
        assert FinancialAid.objects.count() == 1
        financial_aid = FinancialAid.objects.first()
        assert financial_aid.tier_program == self.tiers["100k"]
        assert financial_aid.status == FinancialAidStatus.AUTO_APPROVED

    def test_income_validation_missing_args(self):
        """
        Tests IncomeValidationView post with missing args
        """
        for key_to_not_send in ["original_currency", "program_id", "original_income"]:
            data = {key: value for key, value in self.data.items() if key != key_to_not_send}
            resp = self.client.post(self.url, data)
            assert resp.status_code == HTTP_400_BAD_REQUEST

    def test_income_validation_no_financial_aid_availability(self):
        """
        Tests IncomeValidationView post when financial aid not available for program
        """
        self.program.financial_aid_availability = False
        self.program.save()
        resp = self.client.post(self.url, self.data)
        assert resp.status_code == HTTP_400_BAD_REQUEST

    def test_income_validation_user_not_enrolled(self):
        """
        Tests IncomeValidationView post when User not enrolled in program
        """
        self.program_enrollment.user = self.profile2.user
        self.program_enrollment.save()
        resp = self.client.post(self.url, self.data)
        assert resp.status_code == HTTP_400_BAD_REQUEST

    def test_income_validation_currency_not_usd(self):
        """
        Tests IncomeValidationView post  Only takes USD
        """
        self.data["original_currency"] = "NOTUSD"
        resp = self.client.post(self.url, self.data)
        assert resp.status_code == HTTP_400_BAD_REQUEST
