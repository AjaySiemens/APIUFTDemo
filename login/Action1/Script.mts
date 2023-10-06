
sLogger = CreateLogFile()

LoginStartTime = Timer
url = "https://gplm.automation.siemens.com/globalconf/sm/sm2.html?version=cat&project=bt"

SystemUtil.Run "chrome.exe", url
'Systemutil.Run  "chrome.exe", " -incognito " & url


UpdateLogFile sLogger,"PASS", "Browser opened :"


Browser("BT StartUpManager").Maximize()
Browser("BT StartUpManager").ClearCache()


'msgbox Browser("BT StartUpManager").Page("BT StartUpManager").WebElement("AWC").Object.checkVisibility()

wait 2
if not Browser("BT StartUpManager").Page("BT StartUpManager").WebElement("AWC__BT_text").Object.checkVisibility() then
Browser("BT StartUpManager").Page("BT StartUpManager").WebElement("AWC").Click
end if

wait 2
If not Browser("BT StartUpManager").Page("BT StartUpManager").WebElement("AWC__BT__Q").Object.checkVisibility() Then
	Browser("BT StartUpManager").Page("BT StartUpManager").WebElement("AWC__BT_text").Click
End If

wait 2
Browser("BT StartUpManager").Page("BT StartUpManager").WebElement("AWC__BT__Q").Click 
wait 3
Browser("BT StartUpManager").Page("BT StartUpManager").WebList("server_ID_dropdown").Select "MyTC R2.2 QA (TCBQ10) TC 13.2"

wait 2
Browser("BT StartUpManager").Page("BT StartUpManager").WebButton("Start AWC").Submit()

Reporter.ReportEvent micPass,"Environment Selection","TCBQ10 selected successfully"
wait 5
'Browser("BT StartUpManager").Page("BT StartUpManager").WebButton("Start AWC").Object.click()
'wait 2
'
'If Browser("BT StartUpManager").Page("BT StartUpManager").WebElement("AWC").Click Then
'	Browser("BT StartUpManager").Page("BT StartUpManager").WebElement("AWC").Click
'End If
'
'
'wait 1
'If Browser("BT StartUpManager").Page("BT StartUpManager").WebElement("AWC__BT_text").Exist then
'Browser("BT StartUpManager").Page("BT StartUpManager").WebElement("AWC__BT_text").Click
'End If
'wait 1
'
'
'If Browser("BT StartUpManager").Page("BT StartUpManager").WebElement("AWC__BT__Q").Exist Then
'Browser("BT StartUpManager").Page("BT StartUpManager").WebElement("AWC__BT__Q").Click
'End If
'
'
'

'If Browser("signinstage.siemens.com/regpub").Page("signinstage.siemens.com/regpub").WebButton("LoginPKIButton").Exist Then
'	Browser("signinstage.siemens.com/regpub").Page("signinstage.siemens.com/regpub").WebButton("LoginPKIButton").Click
'End If


UpdateLogFile sLogger,"PASS", "PKI Login page opened :"

If  Browser("Teamcenter - Home").Page("signinstage.siemens.com/regpub").WebButton("LoginButton").Exist(100) then 
Services.StartTransaction "login_time"

Browser("Teamcenter - Home").Page("signinstage.siemens.com/regpub").WebButton("LoginButton").Click


'TODO:

UIAProPane("pkisigninstage.siemens.com").InsightObject("Certificate_OK").Click


UIAWindow("Windows Security").Activate
UIAWindow("Windows Security").UIAEdit("PIN").UIAEdit("PKI_PIN").SetValue "83800718"

Window("Windows Security").InsightObject("InsightObjectPKI").Click

Services.EndTransaction "login_time"
Reporter.ReportEvent micPass,"PKI Authentication","successful"
End If
if Browser("Teamcenter - Home").Page("Teamcenter - Home").WebButton("Home").Exist(180) then

LoginEndTime = Timer

Reporter.ReportNote "Login Duration : "&  LoginEndTime - LoginStartTime

UpdateLogFile sLogger,"PASS", "Duration of Login :"&( LoginEndTime - LoginStartTime)
'UpdateLogFile sLogger,"PASS", "Duration of Login :"& "10"
End If 
'wait 2
'if UIAWindow("Windows Security").UIAEdit("PKI_PIN").UIAEdit("PKI_PIN").Exist(5) then
' UIAWindow("Windows Security").UIAEdit("PKI_PIN").UIAEdit("PKI_PIN").SetValue "83800718"
' UIAWindow("Windows Security").UIAButton("PKI_PIN_OK").Click
' End If 

'
'

if Browser("Teamcenter - Home").Page("Teamcenter - Home").WebButton("Home").Exist(180) then
Services.StartTransaction "global_search_time"
GlobalSearchStartTime = Timer

Browser("Teamcenter - Home").Page("Teamcenter - Home").WebButton("Home").Click
End If 
wait 2
Browser("Teamcenter - Home").Page("Teamcenter - Home").WebEdit("Search Box").Set "*"
wait 2
Browser("Teamcenter - Home").Page("Teamcenter - Home").WebElement("searchIcon").Click
wait 2
'Browser("Teamcenter - Home").Page("Teamcenter - Home").WebElement("Search Results by Category").WaitProperty "Search Results by Category ","innertext", 5000
'Browser("Teamcenter - Home").Page("Teamcenter - Home").WebElement("Search Results by Category").Object.checkVisibility()

if Browser("Teamcenter - Home").Page("Teamcenter - Home").WebElement("Search Results by Category").Exist(180) then
Reporter.ReportEvent  micPass ,"GlobalSearch ","GlobalSearch is successful"
End If

GlobalSearchEndTime = Timer
Reporter.ReportNote "GlobalSearch Duration : "& GlobalSearchEndTime - GlobalSearchStartTime
UpdateLogFile sLogger,"PASS", "Duration of GlobalSearch :"&( GlobalSearchEndTime - GlobalSearchStartTime)
Services.EndTransaction "global_search_time"




UploadDatasetStartTime = Timer
Services.StartTransaction "upload_test_time"

TestDir =  Environment.Value("TestDir")
Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
homePath = WshShell.CurrentDirectory
filepath = TestDir & "\dataSetUpload.txt"


If Browser("Teamcenter - Home").Page("Teamcenter - Home").WebButton("FoldersButton").Exist(5) Then
	Browser("Teamcenter - Home").Page("Teamcenter - Home").WebButton("FoldersButton").Click
End If


wait 5
If Browser("Teamcenter - Home").Page("Teamcenter - Home").WebButton("CreateNewObjectIcon").Exist(5) Then
	Browser("Teamcenter - Home").Page("Teamcenter - Home").WebButton("CreateNewObjectIcon").Click
End If

If Browser("Teamcenter - Home").Page("Teamcenter - Home").WebButton("CreateNewObject_AddOption").Exist(5) Then
	Browser("Teamcenter - Home").Page("Teamcenter - Home").WebButton("CreateNewObject_AddOption").Click
End If

If Browser("Teamcenter - Home").Page("Teamcenter - Home").WebFile("fmsFile").Exist(5) Then
	Browser("Teamcenter - Home").Page("Teamcenter - Home").WebFile("fmsFile").Set filepath
End If

''wait 2
'''Window("Google Chrome").Dialog("Open").WinToolbar("Address").Type "C:\Users\z004u4nm\Documents\UFT One\datasetUpload.txt"
''wait 2
'''Window("Google Chrome").Dialog("Open").WinComboBox("File name").Select "C:\Users\z004u4nm\Documents\UFT One\datasetUpload.txt"
'''Window("Google Chrome").Dialog("Open").WinButton("OpenButton").Click

Browser("Teamcenter - Home").Page("Teamcenter - Home").WebButton("Add_FileUpload").Click
'
if UIAObject("Teamcenter - Home - Google").UIAObject("Teamcenter - Home").UIAList("noty_bottom_layout_container").UIAObject("noty_1050345273146345900").Exist(10) then
Reporter.ReportEvent micPass ,"DATASET UPLOAD","dataset uploaded successfully"
End If 
''UIAProPane("Teamcenter - Home - Google").UIAProDocument("Teamcenter - Home").UIAProList("noty_bottom_layout_container").UIAProListItem("ListItem").UIAProText("'datasetUpload' was added.")

Services.EndTransaction "upload_test_time"
UploadDatasetEndTime = Timer
Reporter.ReportNote "Upload Duration : "& UploadDatasetEndTime - UploadDatasetStartTime
UpdateLogFile sLogger,"PASS", "Duration of uploading dataset : :"&( UploadDatasetEndTime - UploadDatasetStartTime)
Services.StartTransaction "download_test_time"

DownloadDatasetStartTime = Timer
Browser("Teamcenter - Home").Page("Teamcenter - Home").WebButton("FoldersButton").Click

Browser("Teamcenter - Home").Page("Teamcenter - Home").WebElement("dataseUploadFileTExtNavigateTab").Click
Browser("Teamcenter - Home").Page("Teamcenter - Home").WebElement("datasetUploadPreview").Click
Browser("Teamcenter - Home").Page("Teamcenter - Home").WebElement("Download FileFromDropDown").Click
'if  UIAObject("Teamcenter - Home - Google").UIAButton("Show all").Exist then
'Reporter.ReportEvent micPass,"DATSET DOWNLOAD","Downloading successfully"
'End If 
filename =  ReadFromExcel("ExcelData.xlsx","sheet1","UploadFilePath")
'msgbox filename
filepath = getDownloadFolderPath & filename
'msgbox filepath
If FileExists(filepath) Then
  'msgbox "Does Exist"
  Set fso = CreateObject("Scripting.FileSystemObject")
  fso.DeleteFile filepath
  Reporter.ReportEvent micPass,"DATSET DOWNLOAD","Downloading successfully"
Else
  msgbox  "Does not exist"
End If

DownloadDatasetEndTime = Timer
Reporter.ReportNote "Download Duration : "& DownloadDatasetEndTime - DownloadDatasetStartTime
Services.EndTransaction "download_test_time"
UpdateLogFile sLogger,"PASS", "Duration of downloading dataset : :"&(DownloadDatasetEndTime - DownloadDatasetStartTime)
'UIAObject("Teamcenter - Home - Google").UIAButton("Close").Click


