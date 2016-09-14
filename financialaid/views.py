"""
Views from financialaid
"""
from datetime import datetime
from django.contrib.auth.models import User
from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from financialaid.models import FinancialAid
from financialaid.serializers import FinancialAidSerializer


class IncomeValidationView(APIView):
    """
    View for income validation API. Takes income and currency, then determines whether review
     is necessary, and if not, sets the appropriate tier for personalized pricing.
    """
    serializer_class = FinancialAidSerializer
    authentication_classes = (SessionAuthentication, )
    permission_classes = (IsAuthenticated, )

    def post(self, request, *args, **kwargs):

        currency = request.data('currency')
        program = request.data('program')
        income = request.data('income')

        if request.user not in User.objects.filter(programenrollment__program=program):
            raise ValidationError("User not in program")

        if not program.financial_aid_availability:
            raise ValidationError("Financial aid not available for this program")

        #TODO: Add currency conversion here.
        if currency != "USD":
            raise ValidationError("Only USD supported currently")

        # 1. convert income to USD
        # 2. check country income thresholds

        # To determine the tier for a user, find the set of every tier whose income threshold is
        # less than or equal to the income of the user. The highest tier out of that set will
        # be the tier assigned to the user.
        tiers_set = program.tiers.filter(current=True, income_threshold__lte=income)
        tier = tiers_set.order_by("-income_threshold")[0]

        FinancialAid.objects.create(
            user=request.user,
            tier=tier,
            original_income=income,
            income_usd=income, # TODO: change this when we implement currency conversion
            original_currency=currency,
            country_of_income=request.user.profile.country,
            date_exchange_rate=datetime.now()
        )

        # 3. does it need review?
        # 4. if not, what tier?


        # country to income
        # country to currency





