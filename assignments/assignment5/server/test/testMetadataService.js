// test/testMetadataService.js
const metadataService = require('../services/metadataService');

async function testMetadataService() {
  console.log('Testing Metadata Microservice Integration...\n');

  // Test 1: Add metadata
  console.log('1. Testing addOrUpdateMetadata...');
  const testFileId = Date.now();
  const testMetadata = {
    originalName: 'test-document.pdf',
    fileName: `${Date.now()}-test-document.pdf`,
    fileSize: 1024000,
    mimeType: 'application/pdf',
    filePath: 'documents/test-document.pdf',
    uploadDate: new Date().toISOString(),
    category: 'application',
    fileExtension: '.pdf'
  };

  try {
    const addResult = await metadataService.addOrUpdateMetadata(testFileId, testMetadata);
    console.log('Add result:', addResult);
    
    if (addResult.success) {
      console.log('✓ Successfully added metadata to microservice');
      
      // Test 2: Retrieve metadata
      console.log('\n2. Testing getMetadata...');
      const getResult = await metadataService.getMetadata(testFileId);
      console.log('Get result:', getResult);
      
      if (getResult.success) {
        console.log('✓ Successfully retrieved metadata from microservice');
        console.log('Retrieved data:', JSON.stringify(getResult.data, null, 2));
      } else {
        console.log('✗ Failed to retrieve metadata');
      }
    } else {
      console.log('✗ Failed to add metadata');
    }
  } catch (error) {
    console.error('Error during testing:', error);
  }

  // Test 3: Test with non-existent file
  console.log('\n3. Testing with non-existent file...');
  try {
    const nonExistentResult = await metadataService.getMetadata(999999);
    console.log('Non-existent file result:', nonExistentResult);
    
    if (!nonExistentResult.success && nonExistentResult.status === 404) {
      console.log('✓ Correctly handles non-existent files');
    } else {
      console.log('⚠ Unexpected response for non-existent file');
    }
  } catch (error) {
    console.error('Error testing non-existent file:', error);
  }

  console.log('\nTesting completed!');
}

// Run the test if this file is executed directly
if (require.main === module) {
  testMetadataService().catch(console.error);
}

module.exports = testMetadataService;
