'use strict'
import path from 'path'
import fs from 'fs'
import xml2js from 'xml2js'
import env from '../env'

import extractColumnDescriptions from '../parse/query-processor'

const XML_TEMPLATE_DIR = path.resolve(__dirname, '../xml-templates')
const XML_OUTPUT_DIR = path.resolve(__dirname, '../csv-data-files/metadata-files')

const PRESET_ELEMENT_VALUES = {
  ENTTYPDS: 'Producer Defined',
  ATTRDEFS: 'Producer Defined'
}

function addXmlEnttypeElement(xmlDetailedElement: any, tableName: any) {
  xmlDetailedElement.enttyp[0].enttypl = tableName
  xmlDetailedElement.enttyp[0].enttypds = PRESET_ELEMENT_VALUES.ENTTYPDS
}

function addXmlAttributeElements(xmlDetailedElement: any, xmlAttrElementCount: any, columnNameDescriptionString: any) {
  const [columnName, columnDescription] = columnNameDescriptionString.split(env.DELIMITER)
  if (xmlAttrElementCount === 0) {
    xmlDetailedElement.enttyp[0].attr = []
  }
  const attr = {
      'attrlabl': columnName,
      'attrdef': columnDescription,
      'attrdefs': PRESET_ELEMENT_VALUES.ATTRDEFS,
      'attrdomv': {
        'udom': ''
      }
    }
  xmlDetailedElement.enttyp[0].attr[xmlAttrElementCount] = attr
  //console.log(columnName)
  //console.log(columnDescription)
}

 async function generateMetadataXmlFile(columnDescriptions:any, tableName: any) {

  let descriptions = columnDescriptions
  
  const xml2jsParser = new xml2js.Parser()
  const xmlTemplateName = (tableName === 'filterTable') ? 'geoIndicators.xml' : tableName + '.xml'

  if(descriptions!==null && descriptions!==undefined){

    fs.readFile(path.join(XML_TEMPLATE_DIR, xmlTemplateName), function(err, data) {
      xml2jsParser.parseString(data, (err: Error | null, result: any) => {
  
        
        if (err) console.log(err)
  
        const xmlDetailedElement = result.metadata.eainfo[0].detailed[0]
        addXmlEnttypeElement(xmlDetailedElement, tableName)
        let xmlAttrElementCount = 0
   
        for (let columnNameDescriptionString of descriptions) {
          addXmlAttributeElements(xmlDetailedElement, xmlAttrElementCount, columnNameDescriptionString)
          xmlAttrElementCount += 1
        }
        const xml2jsBuilder = new xml2js.Builder();
        return xml2jsBuilder.buildObject(result)
      });
      
    });
  } 
}

export default generateMetadataXmlFile