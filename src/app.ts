abstract class TemplateFactory {
  protected node: HTMLElement;

  constructor(protected templateId: string) {
    this.node = this.makeNode();
  }

  abstract toNode(): HTMLElement;

  protected makeNode() {
    const template = document.querySelector(this.templateId) as HTMLTemplateElement;
    return template.content.cloneNode(true) as HTMLElement;
  }
}

class ProjectInputFactory extends TemplateFactory {
  constructor() {
    super('#project-input');
  }

  toNode() {
    return this.node;
  }
}

class ProjectListFactory extends TemplateFactory {
  constructor(id: string, header: string) {
    super('#project-list');
    this.node.querySelector('section')!.id = id;
    this.node.querySelector('h2')!.textContent = header;
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
    this.node.querySelector('li')!.id = this.guid;
    this.node.querySelector('h2')!.textContent = this.title;
    this.node.querySelector('h3')!.textContent = this.description;
    this.node.querySelector('p')!.textContent = this.people.toString();
    return this.node;
  }
}

const main = () => {
  const app = document.querySelector('#app') as HTMLElement;

  if (!isTemplateSupported()) {
    renderTemplateNotSupported(app);
    return;
  }

  const projectInputFactory = new ProjectInputFactory();
  app.appendChild(projectInputFactory.toNode());
  const activeListFactory = new ProjectListFactory('active-projects', 'ACTIVE PROJECTS');
  app.appendChild(activeListFactory.toNode());
  const finishedListFactory = new ProjectListFactory('finished-projects', 'FINISHED PROJECTS');
  app.appendChild(finishedListFactory.toNode());

  addFormSubmitListener();
};

const addFormSubmitListener = () => {
  const form = document.querySelector('form')!;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = form.querySelector('#title') as HTMLInputElement;
    const description = form.querySelector('#description') as HTMLInputElement;
    const people = form.querySelector('#people') as HTMLInputElement;

    const newProject: ProjectFactory = new ProjectFactory(
      title.value,
      description.value,
      parseInt(people.value, 10),
    );

    const list = document.querySelector('#active-projects ul')!;
    list.appendChild(newProject.toNode());

    title.value = '';
    description.value = '';
    people.value = '';
  });
};

const isTemplateSupported = () => {
  return 'content' in document.createElement('template');
};

const renderTemplateNotSupported = (app: HTMLElement) => {
  app
    .appendChild(document.createElement('h1'))
    .appendChild(document.createTextNode('Your browser is not supported'));
};

const allowDrop = (event: DragEvent) => {
  event.preventDefault();
};

const drag = (event: DragEvent) => {
  event.dataTransfer!.setData('text', (event.target as HTMLElement).id);
};

const drop = (event: DragEvent) => {
  event.preventDefault();
  const data = event.dataTransfer!.getData('text');
  const node = document.getElementById(data)!;
  const target = event.target as HTMLElement;

  if ((target.parentNode! as HTMLElement).classList.contains('projects')) {
    if (target.nodeName === 'UL') {
      target.appendChild(node);
    } else if (target.nodeName === 'HEADER') {
      target.parentNode!.querySelector('ul')!.appendChild(node);
    }
  }
};

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

main();
