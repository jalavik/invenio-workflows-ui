/*
 * This file is part of Invenio.
 * Copyright (C) 2015 CERN.
 *
 * Invenio is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * Invenio is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Invenio; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.
 */


define(
  [
    'jquery',
    'flight',
    'hgn!js/workflows/templates/pagination'
  ],
  function(
    $,
    flight,
    tpl_pagination_src) {

    'use strict';

    return flight.component(WorkflowsUIPagination);

    /**
    * .. js:class:: WorkflowsUI()
    *
    * workflows UI table
    *
    */
    function WorkflowsUIPagination() {
      this.attributes({
        paginationButtonSelector: ".pagination a"
      });

      this.updatePagination = function(ev, data) {
        if (data.pagination.total_count > 0) {
          var pagination_data = {
            "has_prev": data.pagination.page > 1,
            "has_next": data.pagination.page < data.pagination.pages,
            "next": data.pagination.page + 1,
            "prev": data.pagination.page - 1,
            "iter_pages": data.pagination.iter_pages
          };
          this.$node.html(tpl_pagination_src(pagination_data));
        } else {
          this.$node.html("");
        }
      };

      this.changePage = function(ev, data) {
        console.log($(data.el).data("page"));
        // Check that the pagination button is not disabled.
        var parentClasses = $(data.el.parentElement).attr("class");
        if (parentClasses && parentClasses.indexOf("disabled") >= 0) {
          return;
        } else {
          var page = $(data.el).data("page");
          this.trigger(document, "reloadWorkflowsUITable", {"page": page});
        }
      };

      this.after('initialize', function() {
        this.on("click", {
          paginationButtonSelector: this.changePage
        });
        this.on(document, "tableReloaded", this.updatePagination);

        // Hotkeys pagination
        this.on(document, "hotkeysPagination", this.changePage);

        console.log("Pagination init");
      });
    }
});
