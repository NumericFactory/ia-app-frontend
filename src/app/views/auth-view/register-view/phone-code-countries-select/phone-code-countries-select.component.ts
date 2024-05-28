import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownFilterOptions, DropdownModule } from 'primeng/dropdown';
import { phoneCodeCountries } from './phone-code-countries-data';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'ui-phone-code-countries-select',
  standalone: true,
  imports: [DropdownModule, FormsModule, JsonPipe],
  templateUrl: './phone-code-countries-select.component.html',
  styleUrl: './phone-code-countries-select.component.scss'
})
export class PhoneCodeCountriesSelectComponent {

  @Output() phoneCodeEvent = new EventEmitter();

  countries = [...phoneCodeCountries];
  selectedCountry: any;
  filterValue: string | undefined = '';

  resetFunction(options: DropdownFilterOptions) {
    console.log('resetFunction options', options);
    console.log('selected Country', this.selectedCountry);

    if (options && options.reset) { // Linting error: 'options' is always truthy
      options?.reset();
      this.filterValue = '';
    }
  }

  customFilterFunction(event: KeyboardEvent, options: DropdownFilterOptions) {
    console.log('resetFunction options', options);
    console.log('filtered value', this.filterValue);
    if (options && options.filter) { // Linting error: 'options' is always truthy
      options?.filter(event);
    }
  }

  printSelectedCountry() {
    return this.selectedCountry.code;
  }

  selectCountry() {
    console.log('selected country', this.selectedCountry);
    this.phoneCodeEvent.emit(this.selectedCountry.code);
  }

  ngOnInit() {
    console.log(
      'PhoneCodeCountriesSelectComponent initialized',
      this.countries
    );
  }

}
