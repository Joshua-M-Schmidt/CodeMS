from django.shortcuts import render

# Create your views here.
def datenschutz(request):
    return render(request,'documents/datenschutz.html',{})

def impressum(request):
    return render(request,'documents/impressum.html',{})

def referenzen(request):
    return render(request,'documents/referenzen.html')


def tagesablauf_kran(request):
    return render(request,'documents/tagesablauf_kran.html')