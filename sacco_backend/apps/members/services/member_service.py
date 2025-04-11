from django.db import transaction
from ..models import Member, NextOfKin, MemberDocument
from datetime import datetime
import uuid


class MemberService:
    @staticmethod
    def generate_member_number():
        """Generate unique member number"""
        year = datetime.now().year
        random_suffix = uuid.uuid4().hex[:6].upper()
        return f"M{year}{random_suffix}"

    @staticmethod
    @transaction.atomic
    def register_member(user, member_data, next_of_kin_data=None):
        """Register new member with next of kin"""
        member_data['user'] = user
        member_data['member_number'] = MemberService.generate_member_number()
        member_data['membership_number'] = f"SACCO{member_data['member_number']}"

        member = Member.objects.create(**member_data)

        if next_of_kin_data:
            for kin_data in next_of_kin_data:
                kin_data['member'] = member
                NextOfKin.objects.create(**kin_data)

        return member

    @staticmethod
    def update_member_status(member, status):
        """Update member status"""
        member.membership_status = status
        member.save()
        return member