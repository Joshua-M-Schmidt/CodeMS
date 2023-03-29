from django import forms
import datetime
from .models import STATUS_CHOICES, FEW_FREE_PLACES

class RegisterForCourse(forms.Form):
    first_name = forms.CharField(label='Vorname',max_length=100)
    second_name = forms.CharField(label='Nachname',max_length=100)
    birthday = forms.CharField(label='Geburtsdatum',max_length=100)
    birth_location = forms.CharField(label='Geburtsort',max_length=100)
    your_email = forms.EmailField(label="Email")

class NewCourse(forms.Form):
    date = forms.DateField(label='Datum')
    time = forms.TimeField(label='Uhrzeit',initial=datetime.time(8, 00))
    cost = forms.IntegerField(initial=180,label='Kosten')
    status = forms.ChoiceField(widget=forms.Select(),label='Anmelde Status',choices=STATUS_CHOICES, initial=FEW_FREE_PLACES)
    location = forms.CharField(label="Ort",max_length=100)
    location_post_id = forms.CharField(label="Postleitzahl",max_length=100)
