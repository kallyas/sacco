from django.http import JsonResponse
from rest_framework.views import APIView

from integrations.ussd.services.ussd_service import USSDService


class USSDView(APIView):
    permission_classes = []

    def post(self, request):
        session_id = request.data.get('sessionId')
        phone_number = request.data.get('phoneNumber')
        text = request.data.get('text', '')

        try:
            response, continue_session = USSDService.process_request(
                session_id,
                phone_number,
                text
            )

            return JsonResponse({
                'response': response,
                'continue': continue_session
            })
        except Exception as e:
            print(e)
            return JsonResponse({
                'response': "Service error, please try again later",
                'continue': False
            })
