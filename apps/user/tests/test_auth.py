from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class AuthRegisterTests(APITestCase):
    def setUp(self):
        self.url = reverse("auth:auth-register")

    def test_register_success(self):
        data = {"email": "newuser@example.com", "password": "StrongPass123!"}
        response = self.client.post(self.url, data, format="json")
        # Should return 201 and both tokens
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

        # User should exist and password must be hashed
        user = User.objects.get(email="newuser@example.com")
        self.assertNotEqual(user.password, data["password"])
        self.assertTrue(user.check_password(data["password"]))

    def test_register_missing_fields(self):
        # Missing password
        response = self.client.post(self.url, {"email": "x@example.com"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

        # Missing email
        response = self.client.post(self.url, {"password": "foo"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_register_user_already_exists(self):
        # Pre‑create a user
        User.objects.create_user(email="dup@example.com", password="InitPass123!")
        data = {"email": "dup@example.com", "password": "AnotherPass456!"}
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data.get("error"), "User exists")
