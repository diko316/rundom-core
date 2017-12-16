'use strict';


export class Node {

    constructor() {

        var me = this;

        me.isAlive = true;

        me.parent = 
            me.first = 
            me.last = 
            me.after = 
            me.before = null;

    }

    onDestroy() {
        var me = this,
            parent = me.parent,
            last = this.last;
        var subject;

        if (parent) {
            parent.remove(me);
        }

        // remove children
        for (subject = last; subject;) {
            subject = last.before;
            last.destroy();
        }
    }

    onRemove(node) {

    }

    onAdd(node) {

    }

    isAdoptable(node) {
        return node instanceof Node;
    }

    configure(node) {
        return node;
    }

    hasParent(node) {
        var parent;
        
        if (this.isAdoptable(node)) {
            for (parent = node.parent; parent; parent = parent.parent) {
                if (parent === this) {
                    return true;
                }
            }
        }

        return false;
    }

    add(node, before) {
        var me = this;
        var parent, after;

        node = me.configure(node);

        if (!me.isAdoptable(node)||
            node.parent === me || node.hasParent(me)) {

            throw new Error('Invalid [node] to insert.');

        }
            
        // validate insertion
        if (!me.isAdoptable(before)) {
            before = null;
        }
        else if (before.parent !== me) {
            throw new Error('Invalid node [before] parameter.')
        }
        
        // detach
        parent = node.parent;
        if (parent) {
            parent.remove(node);
        }

        // own child
        node.parent = me;

        // append
        after = before;
        before = after ?
            after && after.before : me.last;


        if (before) {
            before.after = node;
        }
        else {
            me.first = node;
        }

        node.before = before;

        if (after) {
            after.before = node;
        }
        else {
            me.last = node;
        }

        node.after = after;

        this.onAdd(node);
        
        return node;

    }

    remove(node) {
        var me = this;
        var before, after;

        if (!me.isAdoptable(node) ||
            node.parent !== me) {
            throw new Error('Invalid [node] to remove.');
        }

        before = node.before;
        after = node.after;

        if (before) {
            before.after = after;
        }
        else {
            me.first = after;
        }

        if (after) {
            after.before = before;
        }
        else {
            me.last = before;
        }

        this.onRemove(node);

        return node;

    }

    destroy() {
        var me = this;

        if (me.isAlive) {
            
            delete me.isAlive;

            me.onDestroy();
            
        }

        return me;
    }
    

    




}
