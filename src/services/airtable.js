import Airtable from 'airtable';

const base = new Airtable({
  apiKey: 'patXGPPNuAHIkWMKz.fb36c2a301aea29a81ed92adeea0199b3d00b031b91cbcc43bb469f6b3bcd032'
}).base('app6Kxfw7kVFiBeXh');

// Keep track of which records we've already seen
const seenRecordIds = new Set();

export const fetchRandomVideo = async () => {
  try {
    // First, get all records if we haven't fetched them yet
    if (!fetchRandomVideo.allRecordIds) {
      const allRecords = await base('tblxTiA5MS98iKPoa')
        .select({
          view: 'viwHML462kaM2yT06',
          // We need at least one field to fetch records
          fields: ['attachment']
        })
        .all();
      
      fetchRandomVideo.allRecordIds = allRecords.map(record => record._rawJson.id);
    }

    // If we've seen all videos, reset the seen records
    if (seenRecordIds.size >= fetchRandomVideo.allRecordIds.length) {
      seenRecordIds.clear();
    }

    // Get available record IDs (ones we haven't seen yet)
    const availableIds = fetchRandomVideo.allRecordIds.filter(id => !seenRecordIds.has(id));
    
    // Pick a random ID from available ones
    const randomIndex = Math.floor(Math.random() * availableIds.length);
    const randomId = availableIds[randomIndex];

    // Fetch the full record for this ID
    const record = await base('tblxTiA5MS98iKPoa').find(randomId);
    
    // Mark this record as seen
    seenRecordIds.add(randomId);

    return {
      id: record.id,
      title: record.fields.title || '',
      description: record.fields.description || '',
      videoUrl: record.fields.attachment?.[0]?.url || '',
      thumbnailUrl: record.fields.attachment?.[0]?.thumbnails?.large?.url || ''
    };
  } catch (error) {
    console.error('Error fetching random video from Airtable:', error);
    throw error;
  }
};

// Keep track of which records we've already seen for the sales videos
const seenSalesRecordIds = new Set();

export const fetchRandomNewVideo = async () => {
  try {
    // First, get all records if we haven't fetched them yet
    if (!fetchRandomNewVideo.allRecordIds) {
      const allRecords = await base('tblpiAyF3gXjUDT1P')
        .select({
          view: 'viwzb32GjIYXErXDL',
          // We need at least one field to fetch records
          fields: ['attachment']
        })
        .all();
      
      fetchRandomNewVideo.allRecordIds = allRecords.map(record => record._rawJson.id);
    }

    // If we've seen all videos, reset the seen records
    if (seenSalesRecordIds.size >= fetchRandomNewVideo.allRecordIds.length) {
      seenSalesRecordIds.clear();
    }

    // Get available record IDs (ones we haven't seen yet)
    const availableIds = fetchRandomNewVideo.allRecordIds.filter(id => !seenSalesRecordIds.has(id));
    
    // Pick a random ID from available ones
    const randomIndex = Math.floor(Math.random() * availableIds.length);
    const randomId = availableIds[randomIndex];

    // Fetch the full record for this ID
    const record = await base('tblpiAyF3gXjUDT1P').find(randomId);
    
    // Mark this record as seen
    seenSalesRecordIds.add(randomId);

    return {
      id: record.id,
      title: record.fields.title || '',
      description: record.fields.description || '',
      videoUrl: record.fields.attachment?.[0]?.url || '',
      thumbnailUrl: record.fields.attachment?.[0]?.thumbnails?.large?.url || ''
    };
  } catch (error) {
    console.error('Error fetching random video from sales Airtable:', error);
    throw error;
  }
}; 