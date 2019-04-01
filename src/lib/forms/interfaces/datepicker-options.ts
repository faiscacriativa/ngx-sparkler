import { BsDatepickerViewMode } from "ngx-bootstrap/datepicker";

export interface DatepickerOptions {

  adaptivePosition: boolean;
  value?: Date | Date[];
  isDisabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  daysDisabled?: number[];
  datesDisabled?: Date[];
  selectFromOtherMonth?: boolean;
  selectWeek?: boolean;
  customTodayClass?: string;
  minMode?: BsDatepickerViewMode;
  containerClass: string;
  displayMonths: number;
  showWeekNumbers: boolean;
  dateInputFormat: string;
  rangeSeparator: string;
  rangeInputFormat: string;
  monthTitle: string;
  yearTitle: string;
  dayLabel: string;
  monthLabel: string;
  yearLabel: string;
  weekNumbers: string;

}
