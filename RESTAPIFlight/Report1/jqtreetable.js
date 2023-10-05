/* 
Copyright: Paul Hanlon

Released under the MIT/BSD licence which means you can do anything you want 
with it, as long as you keep this copyright notice on the page 
*/
(function(jq){
  jq.fn.jqTreeTable=function(map, options){
    var opts = jq.extend({openImg:"",shutImg:"",leafImg:"",lastOpenImg:"",lastShutImg:"",lastLeafImg:"",vertLineImg:"",blankImg:"",collapse:false,column:0,striped:false,highlight:false,state:true},options),
    mapa=[],mapb=[],tid=this.attr("id"),collarr=[],
	  stripe=function(){
      if(opts.striped){
  		  $("#"+tid+" tr:visible").filter(":even").addClass("even").end().filter(":odd").removeClass("even");
      }
	  },
    buildText = function(parno, preStr){//Recursively build up the text for the images that make it work
      var mp=mapa[parno], ro=0, pre="", pref, img;
      for (var y=0,yl=mp.length;y<yl;y++){
        ro = mp[y];
        if (mapa[ro]){//It's a parent as well. Build it's string and move on to it's children
          pre=(y==yl-1)? opts.blankImg: opts.vertLineImg;
          img=(y==yl-1)? opts.lastOpenImg: opts.openImg;
          mapb[ro-1] = preStr + '<img src="'+img+'" class="parimg" id="'+tid+ro+'">';
          pref = preStr + '<img src="'+pre+'" class="preimg">';
          arguments.callee(ro, pref);
        }else{//it's a child
          img = (y==yl-1)? opts.lastLeafImg: opts.leafImg;//It's the last child, It's child will have a blank field behind it
          mapb[ro-1] = preStr + '<img src="'+img+'" class="ttimage" id="'+tid+ro+'">';
        }
      }
    },
    expandKids = function(num, last){//Expands immediate children, and their uncollapsed children
      jq("#"+tid+num).attr("src", (last)? opts.lastOpenImg: opts.openImg);//
      for (var x=0, xl=mapa[num].length;x<xl;x++){
        var mnx = mapa[num][x];
        jq("#"+tid+mnx).parents("tr").removeClass("collapsed");
  			if (mapa[mnx] && opts.state && jq.inArray(mnx, collarr)<0){////If it is a parent and its number is not in the collapsed array
          arguments.callee(mnx,(x==xl-1));//Expand it. More intuitive way of displaying the tree
        }
      }
    },
    collapseKids = function(num, last){//Recursively collapses all children and their children and change icon
      jq("#"+tid+num).attr("src", (last)? opts.lastShutImg: opts.shutImg);
      for (var x=0, xl=mapa[num].length;x<xl;x++){
        var mnx = mapa[num][x];
        jq("#"+tid+mnx).parents("tr").addClass("collapsed");
        if (mapa[mnx]){//If it is a parent
          arguments.callee(mnx,(x==xl-1));
        }
      }
    },
  	creset = function(num, exp){//Resets the collapse array
  		var o = (exp)? collarr.splice(jq.inArray(num, collarr), 1): collarr.push(num);
      cset(tid,collarr);
  	},
  	cget = function(n){
	  	var v='',c=' '+document.cookie+';',s=c.indexOf(' '+n+'=');
	    if (s>=0) {
	    	s+=n.length+2;
	      v=(c.substring(s,c.indexOf(';',s))).split("|");
	    }
	    return v||0;
  	},
    cset = function (n,v) {
  		jq.unique(v);
	  	document.cookie = n+"="+v.join("|")+";";
	  };
    for (var x=0,xl=map.length; x<xl;x++){//From map of parents, get map of kids
      num = map[x];
      if (!mapa[num]){
        mapa[num]=[];
      }
      mapa[num].push(x+1);
    }
    buildText(0,"");
    jq("tr", this).each(function(i){//Inject the images into the column to make it work
      jq(this).children("td").eq(opts.column).prepend(mapb[i]);
      
    });
		collarr = cget(tid)||opts.collapse||collarr;
		if (collarr.length){
			cset(tid,collarr);
	    for (var y=0,yl=collarr.length;y<yl;y++){
	      collapseKids(collarr[y],($("#"+collarr[y]+ " .parimg").attr("src")==opts.lastOpenImg));
	    }
		}
    stripe();
    jq(".parimg", this).each(function(i){
      var jqt = jq(this),last;
      jqt.click(function(){
        var num = parseInt(jqt.attr("id").substr(tid.length));//Number of the row
        if (jqt.parents("tr").next().is(".collapsed")){//If the table row directly below is collapsed
          expandKids(num, (jqt.attr("src")==opts.lastShutImg));//Then expand all children not in collarr
					if(opts.state){creset(num,true);}//If state is set, store in cookie
        }else{//Collapse all and set image to opts.shutImg or opts.lastShutImg on parents
          collapseKids(num, (jqt.attr("src")==opts.lastOpenImg));
					if(opts.state){creset(num,false);}//If state is set, store in cookie
        }
        stripe();//Restripe the rows
      });
    });
    if (opts.highlight){//This is where it highlights the rows
      jq("tr", this).hover(
        function(){jq(this).addClass("over");},
        function(){jq(this).removeClass("over");}
      );
    };
  };
  return this;
})(jQuery);

// SIG // Begin signature block
// SIG // MIIqzwYJKoZIhvcNAQcCoIIqwDCCKrwCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // MqtnW6RLrOSGDtOQJDHk21B4zyGIse0tnkmjewFfRKWg
// SIG // ghHnMIIFbzCCBFegAwIBAgIQSPyTtGBVlI02p8mKidaU
// SIG // FjANBgkqhkiG9w0BAQwFADB7MQswCQYDVQQGEwJHQjEb
// SIG // MBkGA1UECAwSR3JlYXRlciBNYW5jaGVzdGVyMRAwDgYD
// SIG // VQQHDAdTYWxmb3JkMRowGAYDVQQKDBFDb21vZG8gQ0Eg
// SIG // TGltaXRlZDEhMB8GA1UEAwwYQUFBIENlcnRpZmljYXRl
// SIG // IFNlcnZpY2VzMB4XDTIxMDUyNTAwMDAwMFoXDTI4MTIz
// SIG // MTIzNTk1OVowVjELMAkGA1UEBhMCR0IxGDAWBgNVBAoT
// SIG // D1NlY3RpZ28gTGltaXRlZDEtMCsGA1UEAxMkU2VjdGln
// SIG // byBQdWJsaWMgQ29kZSBTaWduaW5nIFJvb3QgUjQ2MIIC
// SIG // IjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAjeeU
// SIG // EiIEJHQu/xYjApKKtq42haxH1CORKz7cfeIxoFFvrISR
// SIG // 41KKteKW3tCHYySJiv/vEpM7fbu2ir29BX8nm2tl06UM
// SIG // abG8STma8W1uquSggyfamg0rUOlLW7O4ZDakfko9qXGr
// SIG // YbNzszwLDO/bM1flvjQ345cbXf0fEj2CA3bm+z9m0pQx
// SIG // afptszSswXp43JJQ8mTHqi0Eq8Nq6uAvp6fcbtfo/9oh
// SIG // q0C/ue4NnsbZnpnvxt4fqQx2sycgoda6/YDnAdLv64Ip
// SIG // lXCN/7sVz/7RDzaiLk8ykHRGa0c1E3cFM09jLrgt4b9l
// SIG // pwRrGNhx+swI8m2JmRCxrds+LOSqGLDGBwF1Z95t6WNj
// SIG // HjZ/aYm+qkU+blpfj6Fby50whjDoA7NAxg0POM1nqFOI
// SIG // +rgwZfpvx+cdsYN0aT6sxGg7seZnM5q2COCABUhA7vaC
// SIG // ZEao9XOwBpXybGWfv1VbHJxXGsd4RnxwqpQbghesh+m2
// SIG // yQ6BHEDWFhcp/FycGCvqRfXvvdVnTyheBe6QTHrnxvTQ
// SIG // /PrNPjJGEyA2igTqt6oHRpwNkzoJZplYXCmjuQymMDg8
// SIG // 0EY2NXycuu7D1fkKdvp+BRtAypI16dV60bV/AK6pkKrF
// SIG // fwGcELEW/MxuGNxvYv6mUKe4e7idFT/+IAx1yCJaE5UZ
// SIG // kADpGtXChvHjjuxf9OUCAwEAAaOCARIwggEOMB8GA1Ud
// SIG // IwQYMBaAFKARCiM+lvEH7OKvKe+CpX/QMKS0MB0GA1Ud
// SIG // DgQWBBQy65Ka/zWWSC8oQEJwIDaRXBeF5jAOBgNVHQ8B
// SIG // Af8EBAMCAYYwDwYDVR0TAQH/BAUwAwEB/zATBgNVHSUE
// SIG // DDAKBggrBgEFBQcDAzAbBgNVHSAEFDASMAYGBFUdIAAw
// SIG // CAYGZ4EMAQQBMEMGA1UdHwQ8MDowOKA2oDSGMmh0dHA6
// SIG // Ly9jcmwuY29tb2RvY2EuY29tL0FBQUNlcnRpZmljYXRl
// SIG // U2VydmljZXMuY3JsMDQGCCsGAQUFBwEBBCgwJjAkBggr
// SIG // BgEFBQcwAYYYaHR0cDovL29jc3AuY29tb2RvY2EuY29t
// SIG // MA0GCSqGSIb3DQEBDAUAA4IBAQASv6Hvi3SamES4aUa1
// SIG // qyQKDKSKZ7g6gb9Fin1SB6iNH04hhTmja14tIIa/ELiu
// SIG // eTtTzbT72ES+BtlcY2fUQBaHRIZyKtYyFfUSg8L54V0R
// SIG // QGf2QidyxSPiAjgaTCDi2wH3zUZPJqJ8ZsBRNraJAlTH
// SIG // /Fj7bADu/pimLpWhDFMpH2/YGaZPnvesCepdgsaLr4Cn
// SIG // vYFIUoQx2jLsFeSmTD1sOXPUC4U5IOCFGmjhp0g4qdE2
// SIG // JXfBjRkWxYhMZn0vY86Y6GnfrDyoXZ3JHFuu2PMvdM+4
// SIG // fvbXg50RlmKarkUT2n/cR/vfw1Kf5gZV6Z2M8jpiUbzs
// SIG // JA8p1FiAhORFe1rYMIIGGjCCBAKgAwIBAgIQYh1tDFIB
// SIG // njuQeRUgiSEcCjANBgkqhkiG9w0BAQwFADBWMQswCQYD
// SIG // VQQGEwJHQjEYMBYGA1UEChMPU2VjdGlnbyBMaW1pdGVk
// SIG // MS0wKwYDVQQDEyRTZWN0aWdvIFB1YmxpYyBDb2RlIFNp
// SIG // Z25pbmcgUm9vdCBSNDYwHhcNMjEwMzIyMDAwMDAwWhcN
// SIG // MzYwMzIxMjM1OTU5WjBUMQswCQYDVQQGEwJHQjEYMBYG
// SIG // A1UEChMPU2VjdGlnbyBMaW1pdGVkMSswKQYDVQQDEyJT
// SIG // ZWN0aWdvIFB1YmxpYyBDb2RlIFNpZ25pbmcgQ0EgUjM2
// SIG // MIIBojANBgkqhkiG9w0BAQEFAAOCAY8AMIIBigKCAYEA
// SIG // myudU/o1P45gBkNqwM/1f/bIU1MYyM7TbH78WAeVF3ll
// SIG // MwsRHgBGRmxDeEDIArCS2VCoVk4Y/8j6stIkmYV5Gej4
// SIG // NgNjVQ4BYoDjGMwdjioXan1hlaGFt4Wk9vT0k2oWJMJj
// SIG // L9G//N523hAm4jF4UjrW2pvv9+hdPX8tbbAfI3v0VdJi
// SIG // JPFy/7XwiunD7mBxNtecM6ytIdUlh08T2z7mJEXZD9OW
// SIG // cJkZk5wDuf2q52PN43jc4T9OkoXZ0arWZVeffvMr/iiI
// SIG // ROSCzKoDmWABDRzV/UiQ5vqsaeFaqQdzFf4ed8peNWh1
// SIG // OaZXnYvZQgWx/SXiJDRSAolRzZEZquE6cbcH747FHncs
// SIG // /Kzcn0Ccv2jrOW+LPmnOyB+tAfiWu01TPhCr9VrkxsHC
// SIG // 5qFNxaThTG5j4/Kc+ODD2dX/fmBECELcvzUHf9shoFvr
// SIG // n35XGf2RPaNTO2uSZ6n9otv7jElspkfK9qEATHZcodp+
// SIG // R4q2OIypxR//YEb3fkDn3UayWW9bAgMBAAGjggFkMIIB
// SIG // YDAfBgNVHSMEGDAWgBQy65Ka/zWWSC8oQEJwIDaRXBeF
// SIG // 5jAdBgNVHQ4EFgQUDyrLIIcouOxvSK4rVKYpqhekzQww
// SIG // DgYDVR0PAQH/BAQDAgGGMBIGA1UdEwEB/wQIMAYBAf8C
// SIG // AQAwEwYDVR0lBAwwCgYIKwYBBQUHAwMwGwYDVR0gBBQw
// SIG // EjAGBgRVHSAAMAgGBmeBDAEEATBLBgNVHR8ERDBCMECg
// SIG // PqA8hjpodHRwOi8vY3JsLnNlY3RpZ28uY29tL1NlY3Rp
// SIG // Z29QdWJsaWNDb2RlU2lnbmluZ1Jvb3RSNDYuY3JsMHsG
// SIG // CCsGAQUFBwEBBG8wbTBGBggrBgEFBQcwAoY6aHR0cDov
// SIG // L2NydC5zZWN0aWdvLmNvbS9TZWN0aWdvUHVibGljQ29k
// SIG // ZVNpZ25pbmdSb290UjQ2LnA3YzAjBggrBgEFBQcwAYYX
// SIG // aHR0cDovL29jc3Auc2VjdGlnby5jb20wDQYJKoZIhvcN
// SIG // AQEMBQADggIBAAb/guF3YzZue6EVIJsT/wT+mHVEYcNW
// SIG // lXHRkT+FoetAQLHI1uBy/YXKZDk8+Y1LoNqHrp22AKMG
// SIG // xQtgCivnDHFyAQ9GXTmlk7MjcgQbDCx6mn7yIawsppWk
// SIG // vfPkKaAQsiqaT9DnMWBHVNIabGqgQSGTrQWo43MOfsPy
// SIG // nhbz2Hyxf5XWKZpRvr3dMapandPfYgoZ8iDL2OR3sYzt
// SIG // gJrbG6VZ9DoTXFm1g0Rf97Aaen1l4c+w3DC+IkwFkvjF
// SIG // V3jS49ZSc4lShKK6BrPTJYs4NG1DGzmpToTnwoqZ8fAm
// SIG // i2XlZnuchC4NPSZaPATHvNIzt+z1PHo35D/f7j2pO1S8
// SIG // BCysQDHCbM5Mnomnq5aYcKCsdbh0czchOm8bkinLrYrK
// SIG // pii+Tk7pwL7TjRKLXkomm5D1Umds++pip8wH2cQpf93a
// SIG // t3VDcOK4N7EwoIJB0kak6pSzEu4I64U6gZs7tS/dGNSl
// SIG // jf2OSSnRr7KWzq03zl8l75jy+hOds9TWSenLbjBQUGR9
// SIG // 6cFr6lEUfAIEHVC1L68Y1GGxx4/eRI82ut83axHMViw1
// SIG // +sVpbPxg51Tbnio1lB93079WPFnYaOvfGAA0e0zcfF/M
// SIG // 9gXr+korwQTh2Prqooq2bYNMvUoUKD85gnJ+t0smrWrb
// SIG // 8dee2CvYZXD5laGtaAxOfy/VKNmwuWuAh9kcMIIGUjCC
// SIG // BLqgAwIBAgIQE5aTjesqH6B1Gfb7VfnciTANBgkqhkiG
// SIG // 9w0BAQwFADBUMQswCQYDVQQGEwJHQjEYMBYGA1UEChMP
// SIG // U2VjdGlnbyBMaW1pdGVkMSswKQYDVQQDEyJTZWN0aWdv
// SIG // IFB1YmxpYyBDb2RlIFNpZ25pbmcgQ0EgUjM2MB4XDTIy
// SIG // MDUwMjAwMDAwMFoXDTIzMDUwMjIzNTk1OVowaTELMAkG
// SIG // A1UEBhMCR0IxEjAQBgNVBAgMCUJlcmtzaGlyZTEiMCAG
// SIG // A1UECgwZTWljcm8gRm9jdXMgR3JvdXAgTGltaXRlZDEi
// SIG // MCAGA1UEAwwZTWljcm8gRm9jdXMgR3JvdXAgTGltaXRl
// SIG // ZDCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIB
// SIG // ALRnxOz54gZI8b7BPwJ4qARTv4F4l4xvR3jRg8022dKI
// SIG // 8NdBXMQtKxwdBexKaJ8X+wU4yNN1mdvFYErWtEnDzLCs
// SIG // Z/VGXANDfg6YS0/ldA22FX/tPn91PhGU5FFgiaaI5ORg
// SIG // KVkEixoOaDwwZ9+/zxLFkaI7mP2PQGGP8GRaRLN8lxyb
// SIG // w0DhJCxCXkm/PYNu+UDL9aX4EVeoFkl3bSQ9DtKxkh2f
// SIG // IgYVzp3B+kdiLsMzbDlybZ29HF6fovH5NyLWaMEznhnK
// SIG // akiJ3xV91ybzK4+KDoDkovq0i4hrJpyQRLtp4if1gXl9
// SIG // YqO3vW5Qpeu9YydZfKlWiuDldjRm9ITNt1l4Bd51g+gT
// SIG // bpuyWsERImGQgSjm3QTRGkv/3rwMI5ataUZPtIT2rWOd
// SIG // p7R0bMXZNDEbna+PJ7ZUojm8m5WKncnrdJvHZiLz/nLF
// SIG // Kgxic30u8ewdpR22FwwxQSC8Gfwdi8KBgv37j4+Aj62G
// SIG // IEVN5OJAyaFNpIcpX0cNzg9gfD8QjE9pipcOIhCeMf1y
// SIG // 1HNDqI53GtdM4AgNJ16vYLu+R6nqUXZP/dPQ63btqGxV
// SIG // MEp2P72GO1sykoZ0Fuq/HDukOhE9otTJVxwu3nRQGpxf
// SIG // PhmNIafpZZcKpFu+PkWQl0eYx/c0s56bXi4YZBEhgKX/
// SIG // 4F2N5wwe7N6Av0f1GfiOXJAfAgMBAAGjggGJMIIBhTAf
// SIG // BgNVHSMEGDAWgBQPKssghyi47G9IritUpimqF6TNDDAd
// SIG // BgNVHQ4EFgQU7IkSOsil8NV2ETGEkwvIRJyVmdgwDgYD
// SIG // VR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwEwYDVR0l
// SIG // BAwwCgYIKwYBBQUHAwMwSgYDVR0gBEMwQTA1BgwrBgEE
// SIG // AbIxAQIBAwIwJTAjBggrBgEFBQcCARYXaHR0cHM6Ly9z
// SIG // ZWN0aWdvLmNvbS9DUFMwCAYGZ4EMAQQBMEkGA1UdHwRC
// SIG // MEAwPqA8oDqGOGh0dHA6Ly9jcmwuc2VjdGlnby5jb20v
// SIG // U2VjdGlnb1B1YmxpY0NvZGVTaWduaW5nQ0FSMzYuY3Js
// SIG // MHkGCCsGAQUFBwEBBG0wazBEBggrBgEFBQcwAoY4aHR0
// SIG // cDovL2NydC5zZWN0aWdvLmNvbS9TZWN0aWdvUHVibGlj
// SIG // Q29kZVNpZ25pbmdDQVIzNi5jcnQwIwYIKwYBBQUHMAGG
// SIG // F2h0dHA6Ly9vY3NwLnNlY3RpZ28uY29tMA0GCSqGSIb3
// SIG // DQEBDAUAA4IBgQCXoC1YAXftUbBwYCW4PbwowQooS6EL
// SIG // yVZxC5FJlUFnVP2k42qwg6p3qM+mgHktsyX2f66BegC7
// SIG // ziq/OuchOTejdCi4wgdnKBLHkDN2HDZyNzC9YED+TgCc
// SIG // hm4brJlWy70/iuJaER4SPyiIhW2NtbXbsHlJ5USDtsKf
// SIG // yAD58GL2T/Zgzr8mthlvd/dWPL3fX7Y199mZ1WMmTVS/
// SIG // Nm7j5OPptS/frjb+35Kmr0Igwox4LIOvmobMvEBi7jz7
// SIG // 3L+ELG1aXj9SsOFN5HNKj1rCo9FMcDCTco0oVLIYUDM0
// SIG // EW2lGnttrFnruo2fw8Hbfm37IE+ZXQ31ltZlX8NRXCaK
// SIG // JU1JX62uPFlALf9P6NxR/hsN5u1mWfYxPECVXHGSnT+n
// SIG // T3Kwysg/TG4L0Ze03ST+/Ra2Lb940vhrBG+qEzKScgG5
// SIG // uJJnJ6+UVrxVHacx+44Tp6+I5Ps0omJwodZwk+0FT/Xp
// SIG // aI0B4vGSkIrzi5vHI7Zi4t7e6WopMPZFS0AbdC3pZfwx
// SIG // ghhAMIIYPAIBATBoMFQxCzAJBgNVBAYTAkdCMRgwFgYD
// SIG // VQQKEw9TZWN0aWdvIExpbWl0ZWQxKzApBgNVBAMTIlNl
// SIG // Y3RpZ28gUHVibGljIENvZGUgU2lnbmluZyBDQSBSMzYC
// SIG // EBOWk43rKh+gdRn2+1X53IkwDQYJYIZIAWUDBAIBBQCg
// SIG // fDAQBgorBgEEAYI3AgEMMQIwADAZBgkqhkiG9w0BCQMx
// SIG // DAYKKwYBBAGCNwIBBDAcBgorBgEEAYI3AgELMQ4wDAYK
// SIG // KwYBBAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQglNkeJsCw
// SIG // YKPKILpCMjjd5fo6tr6fCypRg0SaBGJxvvUwDQYJKoZI
// SIG // hvcNAQEBBQAEggIAFcueA8W39jjEj+ZGi73VuAnkyPx0
// SIG // sBZg0WRChzt1Z1pir197pM8pi1CH9Zuk0SaM3i/zE3xy
// SIG // amzZhXnE8SNRQ3mxLeb+0iQYZ9GI+dZy0CNPUjpacTN6
// SIG // bvkk3v9MQ5dH2EBMNIFCc5WAQPswwdRIOab2ODxgUOKz
// SIG // Pyxwk5ptvA3Xw5k7pSCKGVl3bMHQj/5PtN8ln35r0lJu
// SIG // unw1XzDd0gfwqW4x0tFxSiCHU97vjc+gpl6mGfe6EjnI
// SIG // PnlmBll2CDbwSAdtZ73+qeyId7c8gmKXANW7B/Sbedk3
// SIG // 9hjNXDtUG2ZTFCsnS2wj7Nfk+kHPNg9l2H13xwMKT2co
// SIG // myHrZYfIyDIwk5G5fnEg5cVCDkZ26jYFF0HJFj0LVSkz
// SIG // BE6JXeUmL5huwVJ2LmLDuY7BX4+LWvDgA5Cnx0CJO2D5
// SIG // XOQzFi+sjvemdxa6u1srZ6a3tqjSKNAmaPq9HZL8uBya
// SIG // yfkn0S1dftQCRSY9lMBFTZgiPtCVz0reOo4+dfV3NvaH
// SIG // /xWd7cTmpAW47E2mMlZbZKs9E+6lGKeL54Gk5VXTMICr
// SIG // khBBKaOoGf4P2FyBrqgQncOEEREp7pdJ27ErRCTUX01s
// SIG // yPkfuSnks9gtDM7xIG9k5S8ctDXJgy3ktnnuLPP5EslY
// SIG // R2hJP05ocBVmM9zZLwi23KOpZpiA3qkOYvmAsPShghUr
// SIG // MIIVJwYKKwYBBAGCNwMDATGCFRcwghUTBgkqhkiG9w0B
// SIG // BwKgghUEMIIVAAIBAzENMAsGCWCGSAFlAwQCATCB8wYL
// SIG // KoZIhvcNAQkQAQSggeMEgeAwgd0CAQEGCmCGSAGG+mwK
// SIG // AwUwMTANBglghkgBZQMEAgEFAAQgD4y33B7srKplyiEZ
// SIG // Z3XxIrPvn4pig33EkREf29bvsNYCCGKTmkFONqJxGA8y
// SIG // MDIzMDMyMDA2MjQyOFowAwIBAaB5pHcwdTELMAkGA1UE
// SIG // BhMCQ0ExEDAOBgNVBAgTB09udGFyaW8xDzANBgNVBAcT
// SIG // Bk90dGF3YTEWMBQGA1UEChMNRW50cnVzdCwgSW5jLjEr
// SIG // MCkGA1UEAxMiRW50cnVzdCBUaW1lc3RhbXAgQXV0aG9y
// SIG // aXR5IC0gVFNBMaCCD1gwggQqMIIDEqADAgECAgQ4Y974
// SIG // MA0GCSqGSIb3DQEBBQUAMIG0MRQwEgYDVQQKEwtFbnRy
// SIG // dXN0Lm5ldDFAMD4GA1UECxQ3d3d3LmVudHJ1c3QubmV0
// SIG // L0NQU18yMDQ4IGluY29ycC4gYnkgcmVmLiAobGltaXRz
// SIG // IGxpYWIuKTElMCMGA1UECxMcKGMpIDE5OTkgRW50cnVz
// SIG // dC5uZXQgTGltaXRlZDEzMDEGA1UEAxMqRW50cnVzdC5u
// SIG // ZXQgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkgKDIwNDgp
// SIG // MB4XDTk5MTIyNDE3NTA1MVoXDTI5MDcyNDE0MTUxMlow
// SIG // gbQxFDASBgNVBAoTC0VudHJ1c3QubmV0MUAwPgYDVQQL
// SIG // FDd3d3cuZW50cnVzdC5uZXQvQ1BTXzIwNDggaW5jb3Jw
// SIG // LiBieSByZWYuIChsaW1pdHMgbGlhYi4pMSUwIwYDVQQL
// SIG // ExwoYykgMTk5OSBFbnRydXN0Lm5ldCBMaW1pdGVkMTMw
// SIG // MQYDVQQDEypFbnRydXN0Lm5ldCBDZXJ0aWZpY2F0aW9u
// SIG // IEF1dGhvcml0eSAoMjA0OCkwggEiMA0GCSqGSIb3DQEB
// SIG // AQUAA4IBDwAwggEKAoIBAQCtTUupEoay6qMgBxUWZCor
// SIG // S9G/C0pNju2AdqVnt3hAwHNCyGjA21Mr3V64dpg1k4sa
// SIG // nXwTOg4fW7cez+UkFB6xgamNfbjMa0sD8QIM3KulQCQA
// SIG // f3SUoZ0IKbOIC/WHd51VzeTDftdqZKuFFIaVW5cyUG89
// SIG // yLpmDOP8vbhJwXaJSRn9wKi9iaNnL8afvHEZYLgt6SzJ
// SIG // kHZme5Tir3jWZVNdPNacss8pA/kvpFCy1EjOBTJViv2y
// SIG // ZEwO5JgHddt/37kIVWCFMCn5e0ikaYbjNT8ehl16ehW9
// SIG // 7wCOFSJUFwCQJpO8Dklokb/4R9OdlULBDk3fbybPwxgh
// SIG // YmZDcNbVwAfhAgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIB
// SIG // BjAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBRV5IHR
// SIG // EYC+2Im5CKMx+aEkCRa5cDANBgkqhkiG9w0BAQUFAAOC
// SIG // AQEAO5uPVpsw51OZfHp5p02X1xmVkPsGH8ozfEZjj5Zm
// SIG // JPpAGyEnyuZyc/JP/jGZ/cgMTGhTxoCCE5j6tq3aXT3x
// SIG // zm72FRGUggzuP5WvEasP1y/eHwOPVyweybuaGkSV6xhP
// SIG // ph/NfVcQL5sECVqEtW7YHTrh1p7RbHleeRwUxePQTJM7
// SIG // ZTzt3z2+puWVGsO1GcO9Xlu7/yPvaBnLEpMnXAMtbzDQ
// SIG // HrYarN5a99GqqCem/nmBxHmZM1e6ErCp4EJsk8pW3v5t
// SIG // hAsIi36N6teYIcbz5zx5L16c0UwVjeHsIjfMmkMLl9yA
// SIG // kI2zZ5tvSAgVVs+/8St8Xpp26VmQxXyDNRFlUTCCBRMw
// SIG // ggP7oAMCAQICDFjaE/8AAAAAUc4N9zANBgkqhkiG9w0B
// SIG // AQsFADCBtDEUMBIGA1UEChMLRW50cnVzdC5uZXQxQDA+
// SIG // BgNVBAsUN3d3dy5lbnRydXN0Lm5ldC9DUFNfMjA0OCBp
// SIG // bmNvcnAuIGJ5IHJlZi4gKGxpbWl0cyBsaWFiLikxJTAj
// SIG // BgNVBAsTHChjKSAxOTk5IEVudHJ1c3QubmV0IExpbWl0
// SIG // ZWQxMzAxBgNVBAMTKkVudHJ1c3QubmV0IENlcnRpZmlj
// SIG // YXRpb24gQXV0aG9yaXR5ICgyMDQ4KTAeFw0xNTA3MjIx
// SIG // OTAyNTRaFw0yOTA2MjIxOTMyNTRaMIGyMQswCQYDVQQG
// SIG // EwJVUzEWMBQGA1UEChMNRW50cnVzdCwgSW5jLjEoMCYG
// SIG // A1UECxMfU2VlIHd3dy5lbnRydXN0Lm5ldC9sZWdhbC10
// SIG // ZXJtczE5MDcGA1UECxMwKGMpIDIwMTUgRW50cnVzdCwg
// SIG // SW5jLiAtIGZvciBhdXRob3JpemVkIHVzZSBvbmx5MSYw
// SIG // JAYDVQQDEx1FbnRydXN0IFRpbWVzdGFtcGluZyBDQSAt
// SIG // IFRTMTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
// SIG // ggEBANkj5hSk6HxLhXFY+/iB5nKLXUbDiAAfONCK4dZu
// SIG // VjDlr9pkUH3CEzn7vWa02oT7g9AoH8t26GBQaZvzzk8T
// SIG // 4sE+wd8SyzKj+F5EIg7MOumNSblgdMjeVD1BXkNfKEap
// SIG // prfKECsivFtNW4wXZRKG/Sx31cWgjMrCg+BHV3zncK5i
// SIG // RScxGArUwKQYVVL3YMYES7PdaDJuEB80EbgSeGTx7qng
// SIG // 9+OxIo80WmXLivThRVB035OXpjTm0Ew7nzdJUqdTTp8u
// SIG // Z1ztlvylv3RRiOOqjr3ZsS9fUDAW9FFgImuZy//hVDu5
// SIG // +0Q4pQg5I5tpR/o8xNDnqt9GsuzyihmsKbI4lXUCAwEA
// SIG // AaOCASMwggEfMBIGA1UdEwEB/wQIMAYBAf8CAQAwDgYD
// SIG // VR0PAQH/BAQDAgEGMDsGA1UdIAQ0MDIwMAYEVR0gADAo
// SIG // MCYGCCsGAQUFBwIBFhpodHRwOi8vd3d3LmVudHJ1c3Qu
// SIG // bmV0L3JwYTAzBggrBgEFBQcBAQQnMCUwIwYIKwYBBQUH
// SIG // MAGGF2h0dHA6Ly9vY3NwLmVudHJ1c3QubmV0MDIGA1Ud
// SIG // HwQrMCkwJ6AloCOGIWh0dHA6Ly9jcmwuZW50cnVzdC5u
// SIG // ZXQvMjA0OGNhLmNybDATBgNVHSUEDDAKBggrBgEFBQcD
// SIG // CDAdBgNVHQ4EFgQUw8Jx0nvXaAWuOzmbNCUMYgPHV2gw
// SIG // HwYDVR0jBBgwFoAUVeSB0RGAvtiJuQijMfmhJAkWuXAw
// SIG // DQYJKoZIhvcNAQELBQADggEBAB0k55p0W6pw/LEOMUXX
// SIG // LAB/ZjoroJo0qqxjbYn5n98Nd/0kI/xPnLdvj/P0H7bB
// SIG // /dYcxIyIZsFjjbpXd9O4Gh7IUa3MYDYah2oo6hFl3sw8
// SIG // LIx0t+hQQ9PMKOgVbBEqnxSVKckFV7VnNug8qYPvQcEh
// SIG // FtN+9y0RR2Z2YIISaYx2VXMP3y9LXelsI/gH9rV91mlF
// SIG // nFh9YS78eEtDTomRRkQsoFOoRaH2Fli7kRPyS8XfC8Dn
// SIG // ril6vUWz53Aw5zSO63r207XR3msTmUazi9JNk3W18W+/
// SIG // 3AAowiW/vOejZTTsPw0dl4z6qogipBg12wWOduMQyCmP
// SIG // Y9CurBjZ2sSfURIwggYPMIIE96ADAgECAhBWq5V1KJyl
// SIG // nw4X1AvqBcMfMA0GCSqGSIb3DQEBCwUAMIGyMQswCQYD
// SIG // VQQGEwJVUzEWMBQGA1UEChMNRW50cnVzdCwgSW5jLjEo
// SIG // MCYGA1UECxMfU2VlIHd3dy5lbnRydXN0Lm5ldC9sZWdh
// SIG // bC10ZXJtczE5MDcGA1UECxMwKGMpIDIwMTUgRW50cnVz
// SIG // dCwgSW5jLiAtIGZvciBhdXRob3JpemVkIHVzZSBvbmx5
// SIG // MSYwJAYDVQQDEx1FbnRydXN0IFRpbWVzdGFtcGluZyBD
// SIG // QSAtIFRTMTAeFw0yMjEwMDQxNzIxMDNaFw0yOTAxMDEw
// SIG // MDAwMDBaMHUxCzAJBgNVBAYTAkNBMRAwDgYDVQQIEwdP
// SIG // bnRhcmlvMQ8wDQYDVQQHEwZPdHRhd2ExFjAUBgNVBAoT
// SIG // DUVudHJ1c3QsIEluYy4xKzApBgNVBAMTIkVudHJ1c3Qg
// SIG // VGltZXN0YW1wIEF1dGhvcml0eSAtIFRTQTEwggIiMA0G
// SIG // CSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQDB6qMljkU0
// SIG // F8r1s8UZzAizCxNOoHL27qR2UFgPRtgX6bh3VGmAcbqK
// SIG // X1hnPmdY705QzfrG2W4TM4+tw65G9mdObUM3i4nd+Bed
// SIG // 09Lp+WJD/qSkVOnKt5rgSir5YhHQrWdcWP4aTElqXxYf
// SIG // tGWUHhAWlJt37fOdG1JfGRl12+7PZ1mtyy5KYw6xgnda
// SIG // b2NN6Lgi7C8K20ybJZ6DK2QZtrd0pcO6TA1NrwPmFm3k
// SIG // 8Bizo2fFV6zusy+vfnwrhnptssnaFFIytjFQJur2TzAK
// SIG // qTgVw6qKdEgvRnf/BYTIp+Rghfm82YYgqgzcqaM//JOU
// SIG // S5Ws21S1r8P9fS5B46MghlBFQdQuNjEo9gov98E6zQYU
// SIG // PvqnScFUSrrAfudJB4RKXJmuZwIESKm05cUd7Y8dsT8k
// SIG // wgcHYhxLxTbpVOqLa510S/qqAScnT7r6fSfN7WaNJ3gX
// SIG // DryHc85tfcmOljiiSxXsV0B4psCB2ckDbNvjL/HKgqtA
// SIG // fayacBri3z6bWGQra28PaB4lZz563QG+Y5RR01qEdLKP
// SIG // KdovJLq2z25LzQ2/gd6RtzXmkoUtA8GfFMLFXN95KDoI
// SIG // eGPuIasydYDf9QQO30bcxqmzms1223NXHwwNMP1vdQm8
// SIG // n4szu/BkPPy53WKDsryXrJcx6DnFzLJLv5dkmN0uKv7E
// SIG // J/BXFU1RT4StAwIDAQABo4IBWzCCAVcwDAYDVR0TAQH/
// SIG // BAIwADAdBgNVHQ4EFgQUSg7RpuqCzY5XY+z9vgM3QJAk
// SIG // o9gwHwYDVR0jBBgwFoAUw8Jx0nvXaAWuOzmbNCUMYgPH
// SIG // V2gwaAYIKwYBBQUHAQEEXDBaMCMGCCsGAQUFBzABhhdo
// SIG // dHRwOi8vb2NzcC5lbnRydXN0Lm5ldDAzBggrBgEFBQcw
// SIG // AoYnaHR0cDovL2FpYS5lbnRydXN0Lm5ldC90czEtY2hh
// SIG // aW4yNTYuY2VyMDEGA1UdHwQqMCgwJqAkoCKGIGh0dHA6
// SIG // Ly9jcmwuZW50cnVzdC5uZXQvdHMxY2EuY3JsMA4GA1Ud
// SIG // DwEB/wQEAwIHgDAWBgNVHSUBAf8EDDAKBggrBgEFBQcD
// SIG // CDBCBgNVHSAEOzA5MDcGCmCGSAGG+mwKAQcwKTAnBggr
// SIG // BgEFBQcCARYbaHR0cHM6Ly93d3cuZW50cnVzdC5uZXQv
// SIG // cnBhMA0GCSqGSIb3DQEBCwUAA4IBAQCxwFozYhxqMzLm
// SIG // JDA+b8bmsFI0HalIOwcN7pBkxKrKrXsaR2+B988xxML6
// SIG // Bii5F7wuhA7SRzX+rnjnYxXg2iUEsWPTC8Pro4xBKRHl
// SIG // 6pjuyN3FFfbHVBr+VI27KPYFGwSCqDOGlsiPtMIgBUQL
// SIG // AlujJlrsTLRpvtj8QERdxcdBbj83tXgT5pUU7d7OyoSz
// SIG // 0NvPK6D87rP+iABfprB52ZoPP12X5Z9CDxzn77Dpr3MN
// SIG // uHmaAleaa2xLFCrOrlWmz7HrsaFg3m3cLyZT4T1zLrEI
// SIG // nHKHKciFUIjM6l8InJB6qsqwm+rqQDPiIhXS0Xd+vxiY
// SIG // Ir698kg/zALS0rbrm0mkMYIEmDCCBJQCAQEwgccwgbIx
// SIG // CzAJBgNVBAYTAlVTMRYwFAYDVQQKEw1FbnRydXN0LCBJ
// SIG // bmMuMSgwJgYDVQQLEx9TZWUgd3d3LmVudHJ1c3QubmV0
// SIG // L2xlZ2FsLXRlcm1zMTkwNwYDVQQLEzAoYykgMjAxNSBF
// SIG // bnRydXN0LCBJbmMuIC0gZm9yIGF1dGhvcml6ZWQgdXNl
// SIG // IG9ubHkxJjAkBgNVBAMTHUVudHJ1c3QgVGltZXN0YW1w
// SIG // aW5nIENBIC0gVFMxAhBWq5V1KJylnw4X1AvqBcMfMAsG
// SIG // CWCGSAFlAwQCAaCCAaUwGgYJKoZIhvcNAQkDMQ0GCyqG
// SIG // SIb3DQEJEAEEMBwGCSqGSIb3DQEJBTEPFw0yMzAzMjAw
// SIG // NjI0MjhaMCkGCSqGSIb3DQEJNDEcMBowCwYJYIZIAWUD
// SIG // BAIBoQsGCSqGSIb3DQEBCzAvBgkqhkiG9w0BCQQxIgQg
// SIG // z7quAS0Z/adGbpVJS8RDB/fERn3VaavrW4UdQ08/WFMw
// SIG // ggELBgsqhkiG9w0BCRACLzGB+zCB+DCB9TCB8gQg7mEZ
// SIG // q7qdxbuMLIG++b7ujg4l/dhes/GmNTUmgdm2i68wgc0w
// SIG // gbikgbUwgbIxCzAJBgNVBAYTAlVTMRYwFAYDVQQKEw1F
// SIG // bnRydXN0LCBJbmMuMSgwJgYDVQQLEx9TZWUgd3d3LmVu
// SIG // dHJ1c3QubmV0L2xlZ2FsLXRlcm1zMTkwNwYDVQQLEzAo
// SIG // YykgMjAxNSBFbnRydXN0LCBJbmMuIC0gZm9yIGF1dGhv
// SIG // cml6ZWQgdXNlIG9ubHkxJjAkBgNVBAMTHUVudHJ1c3Qg
// SIG // VGltZXN0YW1waW5nIENBIC0gVFMxAhBWq5V1KJylnw4X
// SIG // 1AvqBcMfMAsGCSqGSIb3DQEBCwSCAgCKthkRe05pTq6W
// SIG // pbvEExymE3c0BpkAIa/41gQzEUnWhtxxOP1Hw0Bt+Fs4
// SIG // SFn+5krAocy+cQPpDVzQrPxq44rRlbkoUjAmvwGJyjnM
// SIG // p/gdTxjwBRHsaRUe6pxiYqSWO7NHM1G6oiMcjHbQouHW
// SIG // lOFlIi+/Qu+eTkMDn56ogWXL5s2YyJhJtXJdJVJSFCu+
// SIG // VUMTwnm4Enwo/Qzc7nxi9KJuD6Ka9LbpU/xAz7xoazt+
// SIG // DSRrPHQzhu9rmh/3hTFsVecx9/Gcm9grPYztExa3TULD
// SIG // AEYN7WHK4foEht2bZby62tFvC6yY29SNpM0pFcMfghQX
// SIG // PZ0m0KJ9UP1GRzXHEZyxXMkVv3WU4LU5vEFMdIyzOOUa
// SIG // yPdt6RFkofwhWR8BX33h098G/SLj9/4PoEyzeHWsPYAl
// SIG // 1CecoyOk/NusciQHhJJXX9StV98roeqAg455WdNR0FYJ
// SIG // msbc9aLYr0EKYjHL2EncJDQ+wjSZTSQn16R29IPYpGyV
// SIG // rHdGRdsxN+f2RF4RtWOaqgTKw1aYVo1xrfjBMehNIHow
// SIG // Ol6yJEfmN8cDBlhuRxnh7Mmj7rlmna2AVAPFAV2jbLvo
// SIG // FRr9vOgX2Zn81P6oUv9Y9YsUrggxqp30NxN5DvG2CVkz
// SIG // TKJ5gtjiN4oM390l/jXTgxCe212cqE30RmVgnOWs5jhk
// SIG // gdQACTXY4g==
// SIG // End signature block
