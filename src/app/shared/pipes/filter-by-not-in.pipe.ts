import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterByNotIn"
})
export class FilterByNotInPipe implements PipeTransform {
  transform(allPages: any[], propertyName: any, currentPage: any): any {
    propertyName ? propertyName : "id";
    if (currentPage !== undefined) {
      // filter users, users which match and return true will be kept, false will be filtered out
      if (allPages.length !== 0 && currentPage !== null) {
        return allPages.filter(item => {
          if (item) {
            return (
              item[propertyName]
                .toLowerCase()
                .indexOf(currentPage.toLowerCase()) == -1
            );
          }
        });
      }
    }
    return allPages;
  }
}
