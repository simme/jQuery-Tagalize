/**
 * Plugin for generating a tag cloud out of links
 */
(function($) {
  var uniqueIdentifier = 0;
  
  $.fn.tagalize = function(options) {
    
    // Default config
    var config = {
      maxTries:     20,
      startColor:   '000000',
      endColor:     '000000',
      startSize:    2.5,
      sizeStep:     3,
      fontDecreaseStep: 0.1,
      sizeToFit:    true,
    };
    
    // Override settings
    if(options) $.extend(config, options);
    
    // Loop over matched elements passed to this plugin and tagalize 'em
    this.each(function(i) {
      var id = 'tagalize-'+uniqueIdentifier+i;
      
      // Backup content
      var content = $(this).children('*:not(a)');
      $(this).children('*:not(a)').remove();
      
      // Add container
      $(this).prepend('<div class="tagalize-container" id="'+id+'"><p></p></div>');
      
      // Move tags into container
      $(this).children('a').each(function() {
        $(this).appendTo('#'+id+' p').after(' ');
      });
      
      // Append backuped content
      $(this).prepend(content);
      
      // Set font-size of container to 100%
      $('#'+id).css('fontSize', '100%');
      
      // Required data
      var tags = $('#'+id+' p a');    // Tags
      var step = calculateGradient(tags.length, config.startColor, config.endColor); // RGB steps in gradient
      var srgb = hexToDec(config.startColor); // Start RGB
      
      // Loop over tags
      var fontSize = config.startSize;
      tags.each(function(i) {
        $(this).css({
          'fontSize': fontSize + 'em',
          'color': '#' + 
            decToHex(Math.round(srgb[0]+step[0]*i)) +
            decToHex(Math.round(srgb[1]+step[1]*i)) +
            decToHex(Math.round(srgb[2]+step[2]*i)),
        });
        
        // Decrase size
        if(i % config.sizeStep == 0) {
  	     fontSize -= config.fontDecreaseStep;
        }
      });
      
      // Adjust size
      if(config.sizeToFit) {
        // Roughly estimate font size to fit
        if($('#'+id).innerHeight() < $('#'+id+' p').outerHeight()) {
          var p = $('#'+id).innerHeight()/$('#'+id+' p').outerHeight();
        } else {
          var p = $('#'+id+' p').outerHeight()/$('#'+id).innerHeight();
        }
        $('#'+id).css('fontSize', 100*p + '%');
        
        // Finetune
        adjustSize('#'+id, '#'+id+' p', config.maxTries);
      }
            
    });
    
    uniqueIdentifier++;
    
    // Return this
    return this;
  
  };
  
  /**
   * Converts hexadecimal colors to rgb values
   * @access private
   * @param string hexadecimal value
   * @return array [r, g, b]
   */
  function hexToDec(hex) {
    // Remove hash
    if(hex.charAt(0) == '#') {
      hex = hex.substr(1, 7);
    }
    
    // Return an array with rgb values
    return Array(parseInt(hex.substr(0, 2), 16), parseInt(hex.substr(2, 2), 16), parseInt(hex.substr(4, 2), 16));
  };
  
  /**
   * Converts a decimal value to it's hex counter part
   * @access private
   * @param int decimal
   * @return string hexadecimal
   */
  function decToHex(dec) {
    if(dec >= 255) {
      dec = 255;
    }
    if(dec < 0) {
      dec = 0;
    }
    
    var hex = dec.toString(16);
    if(hex.length == 1) {
      hex = '0' + hex;
    }
    
    return hex;
  };
  
  /**
   * Calculates the increase/decrease in channels r, g and b
   * for each step needed to create a gradient.
   * @access private
   * @param int number of steps
   * @param string hex start color
   * @param string hex end color
   * @return array [r step, g step, b step]
   */
  function calculateGradient(nrSteps, startColor, endColor) {
    // Get RGB values
    startRGB = hexToDec(startColor);
    endRGB = hexToDec(endColor);
    
    // Return steps
    return Array((endRGB[0] - startRGB[0])/nrSteps, (endRGB[1] - startRGB[1])/nrSteps, (endRGB[2] - startRGB[2])/nrSteps);
  };
  
  /**
   * Adjust size of tags to fit container
   * @access private
   * @param string id of tag container
   * @param string selector for tag wrapper
   * @param int number of max tries to adjust
   */
  function adjustSize(container, tagWrap, maxTries) {
    var containerHeight = $(container).innerHeight();
    var tagWrap = $(tagWrap);
    var tries = 0;
    var fontSize = 100;
	  var modifier = 30;
    
    while(tries < maxTries) {
      
      if(tagWrap.outerHeight() < (containerHeight) && tagWrap.outerHeight() > (containerHeight-5)) {
        return; 
      }
      
      if(tagWrap.outerHeight() >= containerHeight) {
        fontSize -= modifier;
        $(container).css('fontSize', fontSize + '%');
      }
      
      else if(tagWrap.outerHeight() <= containerHeight) {
        fontSize += modifier;
        $(container).css('fontSize', fontSize + '%');
      }
      
      if(modifier > 1) {
        modifier = modifier/1.3;
      }
      
      tries++;
      
    }
  };
  
  /**
   * Private debug method
   */
  function debug(obj) {
    console.log(obj);
  }
  
})(jQuery);