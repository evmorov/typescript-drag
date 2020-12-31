class Project {
  private guid: string;
  private node: HTMLElement;

  constructor(private title: string, private description: string, private people: number) {
    this.guid = uuidv4();
    this.node = this.makeNode();
  }

  toNode() {
    this.node.querySelector('li').id = this.guid;
    this.node.querySelector('h2').textContent = this.title;
    this.node.querySelector('h3').textContent = this.description;
    this.node.querySelector('p').textContent = this.people.toString();
    return this.node;
  }

  private makeNode() {
    const singleProject = document.querySelector('#single-project') as HTMLTemplateElement;
    return singleProject.content.cloneNode(true) as HTMLElement;
  }
}

const main = () => {
  const app = document.querySelector('#app');

  if (!isTemplateSupported()) {
    renderTemplateNotSupported(app);
    return;
  }

  const projectInput = document.querySelector('#project-input') as HTMLTemplateElement;
  app.appendChild(projectInput.content.cloneNode(true));

  const projectList = document.querySelector('#project-list') as HTMLTemplateElement;

  const activeProjectList = projectList.content.cloneNode(true) as HTMLElement;
  activeProjectList.querySelector('h2').textContent = 'ACTIVE PROJECTS';
  activeProjectList.querySelector('section').id = 'active-projects';
  app.appendChild(activeProjectList);

  const finishedProjectList = projectList.content.cloneNode(true) as HTMLElement;
  finishedProjectList.querySelector('h2').textContent = 'FINISHED PROJECTS';
  finishedProjectList.querySelector('section').id = 'finished-projects';
  app.appendChild(finishedProjectList);

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = form.querySelector('#title') as HTMLInputElement;
    const description = form.querySelector('#description') as HTMLInputElement;
    const people = form.querySelector('#people') as HTMLInputElement;

    const newProject: Project = new Project(
      title.value,
      description.value,
      parseInt(people.value, 10),
    );

    const ul = document.querySelector('#active-projects ul');
    const node = newProject.toNode();
    ul.appendChild(node);

    title.value = '';
    description.value = '';
    people.value = '';
  });
};

const isTemplateSupported = () => {
  return 'content' in document.createElement('template');
};

const renderTemplateNotSupported = (app) => {
  app
    .appendChild(document.createElement('h1'))
    .appendChild(document.createTextNode('Your browser is not supported'));
};

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData('text', ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData('text');
  const node = document.getElementById(data);
  const target = ev.target;
  if (target.nodeName != 'UL') return;

  ev.target.appendChild(node);
}

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

main();
