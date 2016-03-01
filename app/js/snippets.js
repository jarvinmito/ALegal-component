var snippets = document.querySelectorAll('.snippet');

[].forEach.call(snippets, function(snippet) {
    snippet.insertAdjacentHTML('beforebegin', '<button class="btn btn-comp" data-clipboard-snippet data-toggle="tooltip" data-placement="bottom" title="Copy this code" >COPY</button>');
  
});

//

var clipboardSnippets = new Clipboard('[data-clipboard-snippet]', {
    target: function(trigger) {
        return trigger.nextElementSibling;
    }
});

clipboardSnippets.on('success', function(e) {
    e.clearSelection();

    showTooltip(e.trigger, 'Copied!');
});

clipboardSnippets.on('error', function(e) {
    showTooltip(e.trigger, fallbackMessage(e.action));
});
