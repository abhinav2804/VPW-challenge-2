"""Unit tests for the maps service."""

from src.services.maps_service import haversine_distance


def test_haversine_distance_zero():
    # Same point
    lat, lng = 28.6139, 77.2090
    dist = haversine_distance(lat, lng, lat, lng)
    assert dist == 0


def test_haversine_distance_known():
    # Approx distance between New Delhi (28.6139, 77.2090) and Mumbai (19.0760, 72.8777)
    # Expected approx 1148 km
    dist = haversine_distance(28.6139, 77.2090, 19.0760, 72.8777)
    assert 1140 < dist < 1160


def test_haversine_distance_short():
    # Points in Delhi
    # Connaught Place to India Gate
    dist = haversine_distance(28.6315, 77.2167, 28.6129, 77.2295)
    assert 2.0 < dist < 2.5
