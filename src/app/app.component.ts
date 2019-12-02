import { Component } from '@angular/core';
//import { data } from 'src/traffic_accidents';

import {} from 'googlemaps';
import { apidata } from './apidata';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { toASCII } from 'punycode';
import { jsondata } from './jsonmap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import "myJSON" from "./custom.geo.json"

import data  from '../custom.geo.json';
import real from '../realjson.json';

//declare var google: any;
declare var MarkerClusterer: any;
declare var $: any;
declare var windows;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'google-map';
  json:any = data;
  json1:any =real;

  filtereddata:any;
  clustermarkers

  totalspent:Number;

  constructor(private http:HttpClient)
  {}
  

  getContentJSON() {
  
    return this.http.get("custom.geo.json");
  }

  ngOnInit(){

  this.loadGoogleMap();


  }

  loadGoogleMap()
  {

    function initialize() {


      var center = new google.maps.LatLng(19.0760,72.8777);

      var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 3,
          center: center,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      
      var opt = {
        tooltip: { isHtml: true },
        zoomOnClick: false,
          "styles" : [
              {textColor: "black", textSize: 15, height: 60, width: 60},
              {textColor: "black", textSize: 15, height: 70, width: 70},                    
              {textColor: "black", textSize: 15, height: 80, width: 80},
              {textColor: "black", textSize: 15, height: 90, width: 90},                    
              {textColor: "black", textSize: 15, height: 100, width: 100}
          ],

      
      };

      var markers = [];
    // console.log(data)


      map.data.addGeoJson(data);
     // here attach a style - I gave red fill and white stroke 
      map.data.setStyle(function(feature) {
          return /** @type {google.maps.Data.StyleOptions} */({

              fillColor: 'red',
              strokeColor: 'white',
              strokeWeight: 2
          });
      });

    
      google.charts.setOnLoadCallback(drawRegionsMap);

      function drawRegionsMap() {
        var data = google.visualization.arrayToDataTable([
          ['Country', 'Spend'],
          ['Germany', 20997.39],
          ['United States', 15997.39],
          ['Brazil', 15997.39],
          ['Canada', 10097.39],
          ['France', 1597.39],
          ['RU', 197.39],
          ['RU', 19700.39]
        ]);
        var options = {};

        var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

        chart.draw(data, options);
      }

      for (var i = 0; i < apidata.Data.length; i++) {
          var accident_injuries = apidata.Data[i]["Country"];
          var accident_title = apidata.Data[i]["Country"];
       //   var accident_title ="Division: " +apidata.Data[i]["Region"] + "\n" +"Operating Unit: " +apidata.Data[i]["OU"] + "\n" +"Spend: " +apidata.Data[i]["Spend"];
          var accident_lnglat = apidata.Data[i]["Coordinates"];

          var contentString = '<table id="customers">'+
          '<tr>'+
        '<th>Division</th>'+
        '<th>Operating Unit</th>'+
        '<th>Spend</th>'+
      '</tr>'+
      '<tr>'+
        '<td>'+apidata.Data[i]["BU"]+'</td>'+
        '<td>'+apidata.Data[i]["OU"]+'</td>'+
        '<td>'+apidata.Data[i]["Spend"]+'</td>'+
     '</tr>'+
    '</table>';
          switch (Number(accident_injuries)) {
              case 1:


                  if(accident_injuries == 'india')    
                  {
                  accident_title = "max";
                  }
                  break;
              case 3:
                  accident_title = "Serious injuries";
                  break;
              case 2:
                  accident_title = "Very serious injuries";
                  break;
              case 5:
                  accident_title = "No injuries";
                  break;
              case 4:
                  accident_title = "Minor injuries";
                  break;
              case 6:
                  accident_title = "Not recorded";
                  break;
          }
          var accident_LatLng = new google.maps.LatLng(Number(accident_lnglat[1]), Number(accident_lnglat[0]));
          var marker = new google.maps.Marker({
              position: accident_LatLng,
             title: accident_title,
            
          });
    
      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });



      google.maps.event.addListener(marker,'mouseover', (function(marker,content,infowindow){ 
        return function() {
           infowindow.setContent(content);
           infowindow.open(map,marker);
        };
    })(marker,contentString,infowindow)); 

    google.maps.event.addListener(marker,'mouseout', (function(marker,content,infowindow){ 
        return function() {
        
           infowindow.close();
        };
    })(marker,contentString,infowindow)); 
   
          markers.push(marker);
       }


       google.maps.event.addListener(marker, 'mouseover', function (e) {
        
        e.mb.target.removeAttribute('title')
        
    }.bind(this)); 

      var markerCluster = new MarkerClusterer(map, markers, opt);



      google.maps.event.addListener(markerCluster, 'clusterclick', function (cluster) {
        var markers = cluster.getMarkers();
    
        var content = '';
        for (var i = 0; i < markers.length; i++) {
            var marker = markers[i];
            content += marker.title;
            content += ("<br>");
      
            console.log(marvelHeroes);
        }
        var marvelHeroes =  apidata.Data.filter(function(data) {
          return data.Country == cluster.markers_[0].title;
        });
             var total =0;
        for( let i=0;i<marvelHeroes.length;i++)
        {
          console.log(marvelHeroes[i].Spend);
         total =  marvelHeroes[i].Spend+ total;
        }
 

       var tableData ='';
    var tableData ='<table  id="customers" ><tr><td>Division</td><td>Operating Unit</td><td>Spend</td></tr>';
$.each(marvelHeroes, function(index, data) {
 tableData += '<tr><td>'+data.BU+'</td><td>'+data.OU+'</td><td>'+data.Spend+'</td></tr>';
});

        infowindow.setPosition(cluster.getCenter());
        infowindow.setContent(tableData);
        infowindow.open(map);
        google.maps.event.addListener(map, 'zoom_changed', function () {
            infowindow.close();
        });
    });

   
  }

 
 google.charts.load('current', {packages: ["corechart"]});

  google.charts.setOnLoadCallback(initialize);

}
}

