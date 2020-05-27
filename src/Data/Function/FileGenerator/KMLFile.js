import {createFileUTF8} from "../FetchBlob";
import RealmServices from "../../Realm/RealmServices";

export async function generateKMLFile(filePath, fileData){
    let status = false;
    await createFileUTF8(filePath, fileData)
        .then((response)=>{
            if(response.status){
                status = true;
            }
        })
        .catch((e)=>{
            alert("generate kml error:",e);
            status = false;
        });

    return status
}

export async function generateKMLData(sessionID, userName){
    let stringTitikApi = "";
    let garisCoordinate = "";

    //TITIK API
    let getTitikApi = RealmServices.query("TABLE_TRACK", `ID_SESSION = "${sessionID}" AND FIRE_STATUS = "Y"`).sorted("INSERT_TIME", false);
    await Promise.all(
        getTitikApi.map((data, index)=>{
            let titikApi = `<?xml version="1.0" encoding="UTF-8"?>
<Placemark>
    <name>TITIK API ${index+1}</name>
    <Point>
        <coordinates>
            ${data.LONGITUDE},${data.LATITUDE}
        </coordinates>
    </Point>
</Placemark>\n`;
            stringTitikApi = stringTitikApi + titikApi.replace("<?xml version=\"1.0\" encoding=\"UTF-8\"?>", "");
        })
    );
    //LINE
    let getCoordinate = RealmServices.findBy("TABLE_TRACK", "ID_SESSION", sessionID).sorted("INSERT_TIME", false);
    await Promise.all(
        getCoordinate.map((data, index)=>{
            if (getCoordinate.length < index){
                garisCoordinate = garisCoordinate + `${data.LONGITUDE.toString()},${data.LATITUDE.toString()}\n`
            }
            else {
                garisCoordinate = garisCoordinate + `${data.LONGITUDE.toString()},${data.LATITUDE.toString()}\n`
            }
        })
    );

    let finalKMLString = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">

<Document>
    <name>${userName}_${sessionID}</name>
    ${stringTitikApi}
    <Style id="yellowLineGreenPoly">
        <LineStyle>
            <color>7f00ffff</color>
            <width>4</width>
        </LineStyle>
        <PolyStyle>
            <color>7f00ff00</color>
        </PolyStyle>
    </Style>
    <Placemark>
        <name>Absolute Extruded</name>
        <description>Transparent green wall with yellow outlines</description>
        <styleUrl>#yellowLineGreenPoly</styleUrl>
        <LineString>
            <extrude>1</extrude>
            <tessellate>1</tessellate>
            <altitudeMode>relativeToGround</altitudeMode>
            <coordinates>
                ${garisCoordinate}
            </coordinates>
        </LineString>
    </Placemark>
</Document>
</kml>`;

    return finalKMLString;
}
