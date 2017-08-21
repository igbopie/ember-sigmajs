import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import GraphEdge from 'ember-sigmajs/components/graph-edge';

let graphEdge;

moduleForComponent('graph-edge', 'Integration | Component | graph edge', {
  integration: true,
  beforeEach() {
    this.register('component:graph-edge', GraphEdge.extend({
      init() {
        this._super(...arguments);
        graphEdge = this;
      }
    }));
  }
});

test('cannot be rendered without sigma-graph parent', function(assert) {
  assert.expectAssertion(() => {
    this.render(hbs`{{#graph-edge}}{{/graph-edge}}`);
  }, /Assertion Failed: Tried to use .* outside the context of a parent component\./)
});

test('it renders with sigma-graph parent', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{#sigma-graph}}
                    {{#graph-node id="n0" label="hello" x=0 y=0 size=1 color="#f00"}}
                    {{/graph-node}}
                    {{#graph-edge id="e0" source="n0" target="n1"}}
                    {{/graph-edge}}
                  {{/sigma-graph}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#sigma-graph}}
      {{#graph-node id="n0" label="hello" x=0 y=0 size=1 color="#f00"}}
      {{/graph-node}}
      {{#graph-edge id="e0" source="n0" target="n1"}}
        template block text
      {{/graph-edge}}
    {{/sigma-graph}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

test('edge properties observed', function(assert) {
  this.render(hbs`
    {{#sigma-graph}}
      {{#graph-node id="n0" label="hello" x=0 y=0 size=1 color="#f00"}}
      {{/graph-node}}
      {{#graph-node id="n1" label="world" x=1 y=1 size=1 color="#a00"}}
      {{/graph-node}}
      {{#graph-edge id="e0" source="n0" target="n1" color="#fff"}}
      {{/graph-edge}}
    {{/sigma-graph}}
  `);
  graphEdge.set('color', '#f0f');
  assert.equal(graphEdge.get('color'), '#f0f');
});
