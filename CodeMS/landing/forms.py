from django import forms
import datetime

class RequestOfferingCrane(forms.Form):
    your_name = forms.CharField(label='Name',max_length=100)
    your_email = forms.EmailField(label="Email")
    your_address_company = forms.CharField(label="Firma")
    your_zip_code = forms.CharField(label="Postleitzahl")
    people = forms.CharField(label="Anzahl der Teilnehmer")
    coments = forms.CharField(label="Anmerkungen (Optional)", required=False)

class RequestOffering(forms.Form):
    your_name = forms.CharField(label='Name',max_length=100)
    your_email = forms.EmailField(label="Email")
    course_type = forms.CharField(label='Schulung (Kran,Stapler,Hebebühne)',max_length=100)
    your_address_company = forms.CharField(label="Firma")
    your_zip_code = forms.CharField(label="Postleitzahl")
    people = forms.CharField(label="Anzahl der Teilnehmer")
    coments = forms.CharField(label="Anmerkungen (Optional)", required=False)
