from apps.members.models import Member


async def verify_kyc(member: Member) -> bool:
    required_documents = ['ID_DOCUMENT', 'PROOF_OF_ADDRESS', 'PHOTOGRAPH']

    documents = await member.documents.filter(
        document_type__in=required_documents,
        is_verified=True
    ).acount()

    return documents == len(required_documents)