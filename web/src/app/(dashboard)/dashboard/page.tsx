export default function DashboardPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Irányítópult</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Placeholder Widgets */}
                <div className="card bg-base-100 shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title">Legutóbbi készletváltozások</h2>
                        <p>Nincs új változás.</p>
                    </div>
                </div>
                <div className="card bg-base-100 shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title">Gyógyszertár kereső</h2>
                        <div className="bg-base-300 h-32 rounded flex items-center justify-center">
                            Térkép helye
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
