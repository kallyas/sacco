# Generated by Django 5.1.4 on 2025-01-08 14:47

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('members', '0002_initial'),
        ('transactions', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ComplianceReport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('report_type', models.CharField(choices=[('AML', 'Anti-Money Laundering'), ('KYC', 'Know Your Customer'), ('AUDIT', 'Audit Report')], max_length=20)),
                ('content', models.JSONField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('processed', models.BooleanField(default=False)),
                ('processed_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('transaction', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='transactions.transaction')),
            ],
        ),
        migrations.CreateModel(
            name='FraudAlert',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('alert_date', models.DateTimeField(auto_now_add=True)),
                ('severity', models.CharField(choices=[('LOW', 'Low'), ('MEDIUM', 'Medium'), ('HIGH', 'High'), ('CRITICAL', 'Critical')], max_length=20)),
                ('description', models.TextField()),
                ('indicators', models.JSONField()),
                ('resolved', models.BooleanField(default=False)),
                ('resolution_notes', models.TextField(null=True)),
                ('member', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='members.member')),
            ],
        ),
        migrations.CreateModel(
            name='RiskAssessment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('assessment_date', models.DateTimeField(auto_now_add=True)),
                ('credit_score', models.IntegerField()),
                ('risk_factors', models.JSONField()),
                ('recommendations', models.JSONField()),
                ('assessor', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('member', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='members.member')),
            ],
        ),
        migrations.CreateModel(
            name='RiskProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('credit_score', models.IntegerField()),
                ('risk_level', models.CharField(max_length=20)),
                ('last_assessment_date', models.DateTimeField()),
                ('next_assessment_date', models.DateTimeField()),
                ('credit_bureau_report', models.JSONField(null=True)),
                ('factors', models.JSONField()),
                ('member', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='members.member')),
            ],
        ),
    ]
