const app = document.querySelector('#app');

if ('content' in document.createElement('template')) {
  const projectInputTemplate = document.querySelector('#project-input') as HTMLTemplateElement;

  app.appendChild(projectInputTemplate.content.cloneNode(true));
} else {
  app
    .appendChild(document.createElement('h1'))
    .appendChild(document.createTextNode('Your browser is not supported'));
}
