abstract class TemplateFactory {
  protected node: HTMLElement;

  constructor(protected templateId: string) {
    this.node = this.makeNode();
  }

  abstract toNode();

  protected makeNode() {
    const template = document.querySelector(this.templateId) as HTMLTemplateElement;
    return template.content.cloneNode(true) as HTMLElement;
  }
}

class ProjectListFactory extends TemplateFactory {
  constructor(id: string, header: string) {
    super('#project-list');
    this.node.querySelector('section').id = id;
    this.node.querySelector('h2').textContent = header;
  }

  toNode() {
    return this.node;
  }
}

class ProjectFactory extends TemplateFactory {
  private guid: string;

  constructor(private title: string, private description: string, private people: number) {
    super('#single-project');
    this.guid = uuidv4();
  }

  toNode() {
    this.node.querySelector('li').id = this.guid;
    this.node.querySelector('h2').textContent = this.title;
    this.node.querySelector('h3').textContent = this.description;
    this.node.querySelector('p').textContent = this.people.toString();
    return this.node;
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

  const activeProjectList = new ProjectListFactory('active-projects', 'ACTIVE PROJECTS');
  app.appendChild(activeProjectList.toNode());

  const finishedProjectList = new ProjectListFactory('finished-projects', 'FINISHED PROJECTS');
  app.appendChild(finishedProjectList.toNode());

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = form.querySelector('#title') as HTMLInputElement;
    const description = form.querySelector('#description') as HTMLInputElement;
    const people = form.querySelector('#people') as HTMLInputElement;

    const newProject: ProjectFactory = new ProjectFactory(
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
