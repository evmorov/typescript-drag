const main = () => {
  const app = document.querySelector('#app');

  if (!isTemplateSupported()) {
    renderTemplateNotSupported(app);
    return;
  }

  const projectInputTemplate = document.querySelector('#project-input') as HTMLTemplateElement;
  app.appendChild(projectInputTemplate.content.cloneNode(true));

  const singleProjectTemplate = document.querySelector('#single-project') as HTMLTemplateElement;
  app.appendChild(singleProjectTemplate.content.cloneNode(true));

  const projectListTemplate = document.querySelector('#project-list') as HTMLTemplateElement;
  app.appendChild(projectListTemplate.content.cloneNode(true));
};

const isTemplateSupported = () => {
  return 'content' in document.createElement('template');
};

const renderTemplateNotSupported = (app) => {
  app
    .appendChild(document.createElement('h1'))
    .appendChild(document.createTextNode('Your browser is not supported'));
};

main();
