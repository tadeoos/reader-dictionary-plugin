const getDefinition = async (text) => {
  const baseUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
  const response = await fetch(`${baseUrl}${text}`);
  return await response.json();
};


export default (ReadwisePluginElement) => ({
  name: 'dictionary-lookup',
  Element: class Dictionary extends ReadwisePluginElement {
    connectedCallback() {
      this.addEventListener('click', (event) => {
        event.stopImmediatePropagation();
        event.stopPropagation();
      });
      const li = document.createElement('li');
      li.classList.add("subPopoverListItem")
      const button = document.createElement('button');
      button.classList.add("subPopoverButton")
      button.innerText = 'Define';
      button.addEventListener('click', async () => {
        console.log('clicked');
        this.actions.closeAnnotationBarPopover();
        if (document.getElementById('dictionary-term')) {
          return;
        }

        const term = this.data.highlight?.content;
        console.log(term);
        const payload = await getDefinition(term);
        console.log(payload);


        const outerDiv = document.createElement('div');
        outerDiv.id = 'dictionary-term';

        const title = document.createElement('h2');
        title.style.marginTop = '8px';
        title.innerText = term;
        outerDiv.appendChild(title);

        const definitionsContainer = document.createElement('div');
        definitionsContainer.style.flex = '1';
        definitionsContainer.style.overflow = 'auto';
        payload.forEach((word) => {
          word.meanings.forEach((meaning) => {
            const meaningContainer = document.createElement('div');
            const ruler = document.createElement('hr');
            ruler.style.borderColor = 'rgba(0,0,0,0.05)';

            const pos = document.createElement('span');
            pos.innerText = meaning.partOfSpeech;
            pos.style.fontSize = '14px';
            pos.style.fontWeight = '700';
            const definitionsList = document.createElement('ol');
            definitionsList.style.listStyle = 'numeric';
            definitionsList.style.marginLeft = '10px';
            definitionsList.style.padding = '5px 15px';
            meaning.definitions.forEach((definition) => {
              const def = document.createElement('li');
              def.innerText = definition.definition;
              def.style.margin = '4px 0';
              def.style.fontSize = '14px';
              definitionsList.appendChild(def);
            });
            meaningContainer.appendChild(ruler);
            meaningContainer.appendChild(pos);
            meaningContainer.appendChild(definitionsList);
            definitionsContainer.appendChild(meaningContainer);
          });
        });
        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.style.marginTop = '20px';
        closeButton.style.maxWidth = '50px';
        closeButton.addEventListener('click', async (event) => {
          console.log('close clicked');
          event.stopPropagation();
          outerDiv.remove();
        });
        outerDiv.appendChild(definitionsContainer);
        outerDiv.appendChild(closeButton);

        const styles = document.createElement('style');
        styles.innerText = `#dictionary-term {
          position: fixed;
          top: 50%;
          left: 50%;
          padding: 16px;
          background-color: var(--background-canvas);
          transform: translate(-50%, -50%);
          border: solid 1px var(--border-secondary-alpha);
          border-radius: 10px;
          max-height: 400px;
          overflow: scroll;
          box-shadow: 0 5px 40px rgb(0 0 0 / 10%);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        `;
        outerDiv.appendChild(styles);

        document.body.appendChild(outerDiv);
      });
      li.appendChild(button)
      this.appendChild(li);
    }

    disconnectedCallback() {
      console.log('disconnected');
    }

    onDataReady() {
      console.log('Data ready');
    }
  },
});
