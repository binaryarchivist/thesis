# Generated by Django 5.1.1 on 2025-05-07 20:23

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("documents", "0005_rename_rewiewer_document_reviewer"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name="document",
            name="review_date",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="document",
            name="review_notes",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="document",
            name="reviewer",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="reviewer",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
