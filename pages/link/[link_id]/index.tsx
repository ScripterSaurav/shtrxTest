import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import { StatsCard } from "components/common";
import DateRangeDropdown from "components/common/DateRangeDropdown";
import UrlCardSingle from "components/common/UrlCardSingle";
import AppLayout from "components/layouts/AppLayout";
import useCountryNames from "hooks/useCountryNames";
import useDateRange from "hooks/useDateRange";
import useLocale from "hooks/useLocale";
import { fetcher } from "lib/fetchers";
import {
  getBrowsersWithClicksByDateRange,
  getCountriesWithClicksByDateRange,
  getDevicesWithClicksByDateRange,
  getReferralWithClicksByDateRange,
  getTopBrowserForLink,
  getTopCountryForLink,
  getTopReferralForLink,
} from "lib/helper";
import Image from "next/image";
import { useRouter } from "next/router";
import { HiCursorClick, HiOutlineExternalLink } from "react-icons/hi";
import { FormattedMessage, useIntl } from "react-intl";
import useSWR from "swr";
import WithPageAuthRequired from "utils/WithPageAuthRequired";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

const SingleLinkPage = () => {
  const router = useRouter();
  const intl = useIntl();
  const { locale } = useLocale();
  const countryNames = useCountryNames(locale);
  const { dateRange, saveDateRange } = useDateRange();
  const { link_id } = router.query;
  const { data: link, error } = useSWR(`/api/link/${link_id}/fetch`, fetcher);
  if (!link) return <div>Loading...</div>;
  if (!link || error) return <div>Error</div>;

  const countriesWithClicks = getCountriesWithClicksByDateRange(
    link,
    dateRange && dateRange.startDate
  );
  const devicesWithClicks = getDevicesWithClicksByDateRange(
    link,
    dateRange && dateRange.startDate
  );

  const browsersWithClicks = getBrowsersWithClicksByDateRange(
    link,
    dateRange && dateRange.startDate
  );

  const referralsWithClicks = getReferralWithClicksByDateRange(
    link,
    dateRange && dateRange.startDate
  );

  return (
    <AppLayout>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatsCard
          title={
            <FormattedMessage
              id="label.totalClick"
              defaultMessage="Total Click"
            />
          }
          value={link.clicks?.length}
          icon={<HiCursorClick />}
        />
        <StatsCard
          title={
            <FormattedMessage
              id="label.topCountry"
              defaultMessage="Top Country"
            />
          }
          value={
            getTopCountryForLink(link)
              ? countryNames[getTopCountryForLink(link)]
              : "N/A"
          }
          icon={<HiCursorClick />}
        />
        <StatsCard
          title={
            <FormattedMessage
              id="label.topReferral"
              defaultMessage="Top Referral"
            />
          }
          value={getTopReferralForLink(link) || "N/A"}
          icon={<HiOutlineExternalLink />}
        />
        <StatsCard
          title={
            <FormattedMessage
              id="label.topBrowser"
              defaultMessage="Top Browser"
            />
          }
          value={getTopBrowserForLink(link) || "N/A"}
          icon={<HiCursorClick />}
        />
      </div>
      <UrlCardSingle link={link} />
      <div className="dark:bg-dark102 dark:border-dark101 flex items-center justify-between rounded-md border bg-white px-6 py-3">
        <p className="text-xl font-semibold">
          {window && window.location.origin}/{link.slug}
        </p>
        <DateRangeDropdown />
      </div>
      {/* create a line chart for the click of the given date range */}

      <div className="mt-4 flex flex-col">
        <div>
          <div className="dark:bg-dark102 mb-4 rounded bg-white p-4">
            <p className="text-xl">Clicks: {link.clicks.length}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="dark:border-dark101 overflow-hidden rounded border-b border-gray-200 shadow">
                  <div className="dark:bg-dark102 dark:border-dark101 border-b bg-gray-50 py-2 px-6 text-lg font-semibold">
                    <FormattedMessage
                      id="label.countries"
                      defaultMessage="Countries"
                    />
                  </div>
                  <table className="dark:divide-dark101 min-w-full divide-y divide-gray-200">
                    <thead className="dark:bg-dark102  bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          <FormattedMessage
                            id="label.name"
                            defaultMessage="Name"
                          />
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          <FormattedMessage
                            id="label.clicks"
                            defaultMessage="Clicks"
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="dark:bg-dark102 dark:divide-dark101 divide-y divide-gray-200 bg-white">
                      {countriesWithClicks &&
                        countriesWithClicks.length > 0 &&
                        countriesWithClicks.map((item: any, index: number) => (
                          <tr key={index}>
                            <td className="flex items-center whitespace-nowrap px-6 py-4">
                              <Image
                                src={`https://flagcdn.com/48x36/${item.country.toLowerCase()}.png`}
                                alt={item.country}
                                width="40"
                                height="30"
                              />
                              <p className="ml-2 text-xl font-semibold">
                                {countryNames[item.country] || item.country}
                              </p>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {item.clicks}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="dark:border-dark101 overflow-hidden rounded border-b border-gray-200 shadow">
                  <div className="dark:bg-dark102 dark:border-dark101 border-b bg-gray-50 py-2 px-6 text-lg font-semibold">
                    <FormattedMessage
                      id="label.devices"
                      defaultMessage="Devices"
                    />
                  </div>
                  <table className="dark:divide-dark101 min-w-full divide-y divide-gray-200">
                    <thead className="dark:bg-dark102  bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          <FormattedMessage
                            id="label.device"
                            defaultMessage="Device"
                          />
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          <FormattedMessage
                            id="label.clicks"
                            defaultMessage="Clicks"
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="dark:bg-dark102 dark:divide-dark101 divide-y divide-gray-200 bg-white">
                      {devicesWithClicks &&
                        devicesWithClicks.length > 0 &&
                        devicesWithClicks.map((item: any, index: number) => (
                          <tr key={index}>
                            <td className="flex items-center whitespace-nowrap px-6 py-4">
                              <p className="ml-2 text-xl font-semibold">
                                {item.device}
                              </p>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {item.clicks}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="dark:border-dark101 overflow-hidden rounded border-b border-gray-200 shadow">
                  <div className="dark:bg-dark102 dark:border-dark101 border-b bg-gray-50 py-2 px-6 text-lg font-semibold">
                    <FormattedMessage
                      id="label.browsers"
                      defaultMessage="Browsers"
                    />
                  </div>
                  <table className="dark:divide-dark101 min-w-full divide-y divide-gray-200">
                    <thead className="dark:bg-dark102  bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          <FormattedMessage
                            id="label.browser"
                            defaultMessage="Browser"
                          />
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          <FormattedMessage
                            id="label.clicks"
                            defaultMessage="Clicks"
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="dark:bg-dark102 dark:divide-dark101 divide-y divide-gray-200 bg-white">
                      {browsersWithClicks &&
                        browsersWithClicks.length > 0 &&
                        browsersWithClicks.map((item: any, index: number) => (
                          <tr key={index}>
                            <td className="flex items-center whitespace-nowrap px-6 py-4">
                              <p className="ml-2 text-xl font-semibold">
                                {item.browser}
                              </p>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {item.clicks}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="dark:border-dark101 overflow-hidden rounded border-b border-gray-200 shadow">
                  <div className="dark:bg-dark102 dark:border-dark101 border-b bg-gray-50 py-2 px-6 text-lg font-semibold">
                    <FormattedMessage
                      id="label.referrals"
                      defaultMessage="Referrals"
                    />
                  </div>
                  <table className="dark:divide-dark101 min-w-full divide-y divide-gray-200">
                    <thead className="dark:bg-dark102  bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          <FormattedMessage
                            id="label.referral"
                            defaultMessage="Referral"
                          />
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          <FormattedMessage
                            id="label.clicks"
                            defaultMessage="Clicks"
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="dark:bg-dark102 dark:divide-dark101 divide-y divide-gray-200 bg-white">
                      {referralsWithClicks &&
                        referralsWithClicks.length > 0 &&
                        referralsWithClicks.map((item: any, index: number) => (
                          <tr key={index}>
                            <td className="flex items-center whitespace-nowrap px-6 py-4">
                              <p className="ml-2 text-xl font-semibold">
                                {new URL(item.referral).host}
                              </p>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {item.clicks}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default WithPageAuthRequired(SingleLinkPage);
