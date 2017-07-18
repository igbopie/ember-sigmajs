import SigmaBase from './sigma-base';
import { ChildMixin } from 'ember-composability-tools';

export default SigmaBase.extend(ChildMixin, {
  attributeBindings: ['source', 'target'],

  events: ['clickEdge',
          'rightClickEdge',
          'overEdge',
          'doubleClickEdge',
          'outEdge',
          'downEdge',
          'upEdge'],

  didInsertParent: function() {
    this._super(...arguments);
    if (this.get('parentComponent')) {
      this.graph().graph.addEdge({
        id: this.get('id'),
        source: this.get('source'),
        target: this.get('target')
      });
    }
  }
});
