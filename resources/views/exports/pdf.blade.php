<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">

    <title>Laporan Transaksi</title>

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
        }

        h2 {
            text-align: center;
            margin-bottom: 5px;
        }

        .period {
            text-align: center;
            margin-bottom: 20px;
            color: #555;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            border: 1px solid #ccc;
            padding: 7px;
        }

        th {
            background: #f3f4f6;
        }

        .right {
            text-align: right;
        }

        .center {
            text-align: center;
        }

        .total {
            font-weight: bold;
            background: #f3f4f6;
        }
    </style>
</head>

<body>

    <h2>Laporan Transaksi</h2>

    <div class="period">
        Periode:
        {{ $startDate ?? '-' }}
        s/d
        {{ $endDate ?? '-' }}
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>ID Transaksi</th>
                <th>Tanggal</th>
                <th>Kasir</th>
                <th>Pembayaran</th>
                <th>Total</th>
            </tr>
        </thead>

        <tbody>
            @forelse ($transactions as $index => $transaction)
                <tr>
                    <td class="center">
                        {{ $index + 1 }}
                    </td>

                    <td class="center">
                        #{{ $transaction->id }}
                    </td>

                    <td>
                        {{ $transaction->created_at->format('d/m/Y H:i') }}
                    </td>

                    <td>
                        {{ $transaction->user->name ?? '-' }}
                    </td>

                    <td>
                        {{ strtoupper($transaction->payment_method) }}
                    </td>

                    <td class="right">
                        Rp {{ number_format($transaction->total, 0, ',', '.') }}
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" class="center">
                        Tidak ada transaksi.
                    </td>
                </tr>
            @endforelse

            @if ($transactions->count() > 0)
                <tr class="total">
                    <td colspan="5" class="right">
                        TOTAL PENJUALAN
                    </td>

                    <td class="right">
                        Rp {{ number_format($total, 0, ',', '.') }}
                    </td>
                </tr>
            @endif
        </tbody>
    </table>

</body>
</html>