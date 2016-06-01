
import T from 'typr'
import assert from 'assert'
import path from 'path'

import Devapt from 'devapt'

const RenderingPlugin = Devapt.RenderingPlugin

import Button from './plugin/button'
import Tree from './plugin/tree'
// import HBox from './plugin/hbox'
// import VBox from './plugin/vbox'
// import List from './plugin/list'
import Table from './plugin/table'
import Tabs from './plugin/tabs'
// import Page from './plugin/page'
// import Script from './plugin/script'
import Menubar from './plugin/menubar'


const plugin_name = 'Foundation-6' 
const context = plugin_name + '/foundation6_rendering_plugin'



export default class Foundation6Plugin extends RenderingPlugin
{
	constructor(arg_manager)
	{
		super(arg_manager, plugin_name, '1.0.0')
		
		const base_dir = __dirname + '/../node_modules/foundation-sites/dist'
		this.add_public_asset('css', '/' + plugin_name + '/foundation.css', path.join(base_dir, 'foundation.css') )
		this.add_public_asset('css', '/' + plugin_name + '/foundation.min.css', path.join(base_dir, 'foundation.min.css') )
		this.add_public_asset('js', '/' + plugin_name + '/foundation.js', path.join(base_dir, 'foundation.js') )
		this.add_public_asset('js', '/' + plugin_name + '/foundation.min.js', path.join(base_dir, 'foundation.min.js') )
		
		const jquery_dir = base_dir + '/../node_modules/jquery/dist'
		this.add_public_asset('js', '/' + plugin_name + '/jquery.js', path.join(jquery_dir, 'jquery.js') )
		this.add_public_asset('js', '/' + plugin_name + '/jquery.min.js', path.join(jquery_dir, 'jquery.min.js') )
		
		const what_dir = base_dir + '/../node_modules/what-input/'
		this.add_public_asset('js', '/' + plugin_name + '/what-input.js', path.join(what_dir, 'what-input.js') )
		this.add_public_asset('js', '/' + plugin_name + '/what-input.min.js', path.join(what_dir, 'what-input.min.js') )
	}
	
    
	/**
     * Get a feature class.
     * @param {string} arg_class_name - feature class name.
     * @returns {object} feature class.
     */
	get_feature_class(arg_class_name)
	{
		assert( T.isString(arg_class_name), context + ':get_class:bad class string')
		
		return Foundation6Plugin.get_class(arg_class_name)
	}
	
	
	create(arg_class_name, arg_name, arg_settings, arg_state)
	{
		assert( T.isString(arg_class_name), context + ':create:bad class string')
		
		switch(arg_class_name)
		{
			case 'Button': return new Button(arg_name, arg_settings, arg_state)
			case 'Tree':   return new Tree(arg_name, arg_settings, arg_state)
			// case 'HBox':   return new HBox(arg_name, arg_settings, arg_state)
			// case 'VBox':   return new VBox(arg_name, arg_settings, arg_state)
			// case 'List':   return new List(arg_name, arg_settings, arg_state)
			case 'Table':  return new Table(arg_name, arg_settings, arg_state)
			case 'Tabs':  return new Tabs(arg_name, arg_settings, arg_state)
			// case 'Page':   return new Page(arg_name, arg_settings, arg_state)
			// case 'Script': return new Script(arg_name, arg_settings, arg_state)
			case 'Menubar': return new Menubar(arg_name, arg_settings, arg_state)
		}
		
		assert(false, context + ':create:bad class name')
		return undefined
	}
	
	
	/**
     * Get a feature class.
     * @param {string} arg_class_name - feature class name.
     * @returns {object} feature class.
	 */
	static get_class(arg_class_name)
	{
		assert( T.isString(arg_class_name), context + ':get_class:bad class string')
		
		switch(arg_class_name)
		{
			case 'Button':   return Button
			case 'Tree':   return Tree
			case 'Table':  return Table
			case 'Tabs':  return Tabs
			case 'Menubar': return Menubar
		}
		
		assert(false, context + ':get_class:bad class name')
		return undefined
	}
	
	
	has(arg_class_name)
	{
		switch(arg_class_name)
		{
			case 'Button':
			case 'Tree':
			// case 'HBox':
			// case 'VBox':
			// case 'List':
			case 'Table':
			case 'Tabs':
			// case 'Page':
			// case 'Script':
			case 'Menubar':
				return true
		}
		
		return false
	}
}
