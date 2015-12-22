/**
* Posts
* @namespace ncs.collections.services
*/
(function () {
	'use strict';

	angular
		.module('oipa.filters')
		.factory('FilterSelection', FilterSelection);

	FilterSelection.$inject = ['$http', 'reportingOrganisationId', 'Programmes', 'Countries', 'Budget', 'Sectors', 'Transaction', 'ImplementingOrganisations', 'ActivityStatus', 'Search'];

	/**
	* @namespace Filters
	* @returns {Factory}
	*/
	function FilterSelection($http, reportingOrganisationId, Programmes, Countries, Budget, Sectors, Transaction, ImplementingOrganisations, ActivityStatus, Search) {
		var m = this;
		m.selectedProgrammes = Programmes.selectedProgrammes;
	    m.selectedCountries = Countries.selectedCountries;
	    m.selectedSectors = Sectors.selectedSectors;
	    m.selectedImplementingOrganisations = ImplementingOrganisations.selectedImplementingOrganisations;
	    m.selectedActivityStatuses = ActivityStatus.selectedActivityStatuses;
	    m.selectedBudget = Budget.budget;
	    m.selectedTransactionYear = Transaction.year;
	    m.search = Search;
		
		m.selectionString = '';
		m.openPanel = '';
		m.openedPanel = '';

		m.save = function(){
			m.updateSelectionString();
			FilterSelection.openedPanel = '';
		}

		m.updateSelectionString = function(){
      		
		   var selectList = [
	        m.selectArrayToString('recipient_country', 'code', m.selectedCountries),
	        m.selectArrayToString('sector', 'code', m.selectedSectors),
			"&participating_organisation_name=" + _.pluck(m.selectedImplementingOrganisations, 'name').map(function(name) {
				return encodeURIComponent(name)
			}).join(','),
	        // m.selectArrayToString('participating_organisations__organisation__code', 'name', m.selectedImplementingOrganisations),
	        m.selectArrayToString('activity_status', 'code', m.selectedActivityStatuses),
	      ];

	      if(m.selectedProgrammes.length){
	      	var list = [];
	      	for(var i = 0; i < m.selectedProgrammes.length; i++){
	            list.push(m.selectedProgrammes[i]['activity_id']);
	        }

	      	selectList.push('&related_activity_id=' + list.join(','));
	      }

	      if(m.selectedBudget.on){
	        selectList.push('&activity_aggregation_incoming_fund_value_gte='+m.selectedBudget.value[0]+'&activity_aggregation_incoming_fund_value_lte='+m.selectedBudget.value[1]);
	      }

	      if(m.selectedTransactionYear.on){
	        selectList.push('&transaction_date_year='+m.selectedTransactionYear.value);
	      }

	      if(Search.searchString != ''){
	        selectList.push('&q='+Search.searchString);
	      }

	      FilterSelection.selectionString = selectList.join('');
	    }

	    m.selectArrayToString = function(header, id_slug, arr){

	      var headerName = '';
	      var list = [];

	      if(arr.length > 0){

	        headerName = '&' + header + '=';
	        for(var i = 0; i < arr.length; i++){
	            list.push(arr[i][header][id_slug]);
	        }
	      }

	      return headerName + list.join(',');
	    }

	    m.removeAll = function(selectedArr){
	      selectedArr.splice(0, selectedArr.length); 
	    }

	    m.reset = function(){

	      m.removeAll(m.selectedCountries);
	      m.removeAll(m.selectedSectors);
	      m.removeAll(m.selectedImplementingOrganisations);
	      m.removeAll(m.selectedActivityStatuses);
	      m.removeAll(m.selectedProgrammes);

	      Search.searchString = '';
	      Budget.toReset = true;
	      Budget.budget.value = [100000,30000000];
	      Budget.budget.on = false;

	      Transaction.toReset = true;
	      Transaction.year.value = 2015;
	      Transaction.year.on = false;

	      m.save();
	    }
		
		var FilterSelection = {
			save: m.save,
			reset: m.reset,
			selectionString: m.selectionString,
			openPanel: m.openPanel,
			openedPanel: m.openedPanel
		};

		return FilterSelection;

		////////////////////

		

		
		
	}
})();
