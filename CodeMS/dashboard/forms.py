from django import forms
import datetime
from landing_private.models import STATUS_CHOICES, FEW_FREE_PLACES

class AddCourseDate(forms.Form):
    date = forms.DateField(label="Datum",input_formats=['%d.%m.%Y'])
    time = forms.TimeField(label="Uhrzeit", initial="08:00" ,input_formats=['%H:%M'],)
    cost = forms.FloatField(label="Kosten",initial=178.5)
    status = forms.CharField(label="Status", initial=FEW_FREE_PLACES)
    location = forms.CharField(label="Ort")
    location_post_id = forms.CharField(label="Plz")