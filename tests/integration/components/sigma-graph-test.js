import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import SigmaGraph from 'ember-cli-sigmajs/components/sigma-graph';
/*global sigma */

let sigmaGraph;

module('sigma-graph', 'Integration | Component | sigma graph', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    // Technique borrowed from
    // https://github.com/miguelcobain/ember-leaflet/blob/master/tests/integration/components/popup-test.js
    this.owner.register('component:sigma-graph', SigmaGraph.extend({
      init() {
        this._super(...arguments);
        sigmaGraph = this;
      }
    }));
  });

  test('it renders', async function(assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{sigma-graph}}`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#sigma-graph}}
        template block text
      {{/sigma-graph}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });

  test('click event', async function(assert) {
    this.set('onClick', (arg) => {
      assert.equal(arg.type, 'click');
    });
    await render(hbs`{{#sigma-graph click=onClick}}{{/sigma-graph}}`);
    this.element.querySelector('div').click();
  });

  test('click node event', async function(assert) {
    assert.expect(2);

    this.set('onClickNode', (arg) => {
      assert.equal(arg.data.node.id, 'n0');
      assert.equal(arg.type, 'clickNode');
    });
    await render(hbs`{{#sigma-graph clickNode=(action onClickNode) }}
                      {{#graph-node id="n0" label="hello" x=1 y=0 size=10 color="#f00"}}
                      {{/graph-node}}
                    {{/sigma-graph}}`);

    sigmaGraph._sigma.dispatchEvent('clickNode', { node: sigmaGraph._sigma.graph.nodes()[0] });
  });

  test('takes existing sigma instance', async function(assert) {
    let s = new sigma();
    this.set('model', { sigmaInst: s });
    await render(hbs`{{#sigma-graph sigmaInst=model.sigmaInst }}
                    {{/sigma-graph}}`);

    assert.equal(sigmaGraph._sigma, s);
  });

  test('batch data', async function(assert) {
    this.set('model', { graphData: {
        nodes: [{ id: 'n0' }, { id: 'n1' }],
        edges: [{ id: 'e0', source: 'n0', target: 'n1'}]
      }
    });
    await render(hbs`{{#sigma-graph graphData=model.graphData }}
                    {{/sigma-graph}}`);
    assert.equal(sigmaGraph._sigma.graph.nodes().length, 2);
  });

  test('new child components allowed given batch data',async function(assert) {
    this.set('model', { graphData: {
        nodes: [{ id: 'n0' }, { id: 'n1' }],
        edges: [{ id: 'e0', source: 'n0', target: 'n1'}]
      }
    });
    await render(hbs`{{#sigma-graph graphData=model.graphData }}
                      {{#graph-node id="n2" label="goodbye" x=0 y=1 size=10 color="#f00"}}
                      {{/graph-node}}
                    {{/sigma-graph}}`);
    assert.equal(sigmaGraph._sigma.graph.nodes().length, 3);
  });

  test('batch data updated', async function(assert) {
    this.set('graphData', {
        nodes: [{ id: 'n0' }, { id: 'n1' }],
        edges: [{ id: 'e0', source: 'n0', target: 'n1'}]
    });
    await render(hbs`{{#sigma-graph graphData=graphData }}
                    {{/sigma-graph}}`);
    assert.equal(sigmaGraph._sigma.graph.nodes().length, 2);
    this.set('graphData', {
        nodes: [{ id: 'n0' }, { id: 'n1' }, { id: 'n2'}],
        edges: [{ id: 'e0', source: 'n0', target: 'n1'}]
    });
    assert.equal(sigmaGraph._sigma.graph.nodes().length, 3);
  });

});