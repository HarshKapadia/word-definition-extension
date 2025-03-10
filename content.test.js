// Basic test file for the content script functionality
describe('Content Script', () => {
  // Mock DOM setup
  document.body.innerHTML = '<div>This is test content</div>';
  
  // Mock selection
  window.getSelection = jest.fn().mockImplementation(() => ({
    toString: () => 'test',
    getRangeAt: () => ({
      getBoundingClientRect: () => ({
        bottom: 100,
        left: 100
      })
    })
  }));
  
  // Mock fetch API
  global.fetch = jest.fn().mockImplementation(() => 
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{
        word: 'test',
        phonetic: '/test/',
        meanings: [{
          partOfSpeech: 'noun',
          definitions: [{
            definition: 'a procedure intended to establish the quality, performance, or reliability of something',
            example: 'the aircraft underwent tests'
          }]
        }]
      }])
    })
  );
  
  // Import the content script
  require('./content');
  
  test('popup should be created on mouseup event', () => {
    // Trigger mouseup event
    const mouseupEvent = new Event('mouseup');
    document.dispatchEvent(mouseupEvent);
    
    // Check if popup is created
    setTimeout(() => {
      const popup = document.getElementById('definition-popup');
      expect(popup).not.toBeNull();
      expect(popup.style.top).toBe('110px');
      expect(popup.style.left).toBe('100px');
    }, 100);
  });
});