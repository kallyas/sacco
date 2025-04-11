from rest_framework import serializers
from .models import Member, NextOfKin, MemberDocument

class NextOfKinSerializer(serializers.ModelSerializer):
    class Meta:
        model = NextOfKin
        fields = '__all__'
        read_only_fields = ['member']

class MemberDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemberDocument
        fields = '__all__'
        read_only_fields = ['member', 'is_verified', 'verified_by', 'verified_at']

class MemberSerializer(serializers.ModelSerializer):
    next_of_kin = NextOfKinSerializer(many=True, read_only=True)
    documents = MemberDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = Member
        fields = '__all__'
        read_only_fields = ['user', 'member_number', 'registration_date']