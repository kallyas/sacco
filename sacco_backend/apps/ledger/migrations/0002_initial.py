# Generated by Django 5.1.4 on 2025-01-08 14:47

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('ledger', '0001_initial'),
        ('transactions', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='ledgerentry',
            name='transaction',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='transactions.transaction'),
        ),
    ]
