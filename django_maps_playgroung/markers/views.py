from django.shortcuts import render

#we can also use some gis functions to work with spacial coodinates
#actually we'r using google maps api v.3 instead database functions 
# from django.contrib.gis.db.models.functions import ...

def home(request):
	return render(request, 'index.html', {})