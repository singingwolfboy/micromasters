"""
Views for financialaid
"""
from rest_framework.authentication import SessionAuthentication
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated

from financialaid.serializers import FinancialAidSerializer


class IncomeValidationView(CreateAPIView):
    """
    View for income validation API. Takes income and currency, then determines whether review
    is necessary, and if not, sets the appropriate tier for personalized pricing.
    """
    serializer_class = FinancialAidSerializer
    authentication_classes = (SessionAuthentication, )
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        """
        Used for returning the view, which hasn't been defined yet.
        """
        return None
